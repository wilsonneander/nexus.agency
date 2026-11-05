// Captura da página inteira com JavaScript DESABILITADO (story 4.4, FR-03).
// Uso: PORT=<n> node scripts/capture_nojs.js            (padrão 3008)
//      SUFFIX=_antes node scripts/capture_nojs.js       → nojs_375_antes.png …
//      JS=1 node scripts/capture_nojs.js                → mesma captura COM JS em
//                                                         375/480/768/1024/1200 (js_<w>.png)
//      OUT_DIR=<pasta> …                                → grava em outra pasta
// Destino: sempre uma pasta temporária fora do repositório (imagens nunca são commitadas).
// Capturas "antes" e de não regressão com JS vão para a pasta temporária do sistema
// (regra de higiene do repositório no CLAUDE.md) — o caminho é impresso no fim.
//
// Por que CDP e não `--screenshot`: com `--blink-settings=scriptEnabled=false`
// o Chrome headless sai sem gravar o arquivo. Aqui o Chrome sobe com
// `--remote-debugging-port` e é dirigido pelo WebSocket nativo do Node (>= 22),
// sem dependência nova: `Emulation.setScriptExecutionDisabled` desliga o JS da
// página. Além do PNG, imprime a cor computada de um `[data-word]` de cada texto
// de leitura progressiva.
// Alturas da janela fixas (HEIGHTS), altas o bastante para o Footer aparecer inteiro.
const PORT = process.env.PORT || 3008;
const SUFFIX = process.env.SUFFIX || '';
const WITH_JS = process.env.JS === '1';
const DEBUG_PORT = 9333;
const http = require('http');
const os = require('os');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const targetDir =
  process.env.OUT_DIR || fs.mkdtempSync(path.join(os.tmpdir(), 'nexus-qa-'));
const url = `http://localhost:${PORT}/`;

// Teto da captura por largura; o script falha se o documento passar disso.
const HEIGHTS = { 375: 17000, 480: 15000, 768: 12000, 1024: 10000, 1200: 9000 };
const VIEWPORT_H = 900;
const widths = WITH_JS ? [375, 480, 768, 1024, 1200] : [375, 1200];

const PROBE = `JSON.stringify({
  words: [...document.querySelectorAll('#home p, #about h2, #about p, #service h2, #service p')]
    .filter((el) => el.querySelector(':scope > [data-word]'))
    .map((el) => ({
      text: el.textContent.trim().slice(0, 40),
      color: getComputedStyle(el.querySelector('[data-word]')).color,
    })),
  footer: !!document.querySelector('footer'),
  docHeight: document.documentElement.scrollHeight,
})`;

const getJson = (u) =>
  new Promise((resolve, reject) => {
    http
      .get(u, (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(data) });
          } catch {
            resolve({ status: res.statusCode, body: null });
          }
        });
      })
      .on('error', reject);
  });

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitForChrome() {
  for (let i = 0; i < 50; i++) {
    try {
      const { body } = await getJson(`http://127.0.0.1:${DEBUG_PORT}/json/list`);
      const page = body && body.find((t) => t.type === 'page');
      if (page) return page.webSocketDebuggerUrl;
    } catch {
      /* Chrome ainda subindo */
    }
    await wait(200);
  }
  throw new Error('Chrome não abriu a porta de depuração');
}

function connect(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let id = 0;
  const pending = new Map();
  const listeners = [];
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
    } else if (msg.method) {
      listeners.filter((l) => l.method === msg.method).forEach((l) => l.fn(msg.params));
    }
  };
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const msgId = ++id;
      pending.set(msgId, { resolve, reject });
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  const once = (method) => new Promise((fn) => listeners.push({ method, fn }));
  return new Promise((resolve) => (ws.onopen = () => resolve({ ws, send, once })));
}

async function main() {
  try {
    const { status } = await getJson(url);
    if (status !== 200) {
      console.error(`${url} respondeu ${status}; abortando.`);
      process.exit(1);
    }
  } catch (err) {
    console.error(`Sem servidor em ${url}: ${err.message}`);
    process.exit(1);
  }

  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'nexus-nojs-'));
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    `--remote-debugging-port=${DEBUG_PORT}`,
    `--user-data-dir=${profile}`,
    'about:blank',
  ]);

  try {
    await waitForChrome();
    for (const w of widths) {
      const h = HEIGHTS[w];
      const name = `${WITH_JS ? 'js' : 'nojs'}_${w}${SUFFIX}.png`;
      // Aba nova por largura: estado limpo e nenhuma navegação repetida na mesma aba.
      const target = await new Promise((resolve, reject) => {
        const req = http.request(
          { host: '127.0.0.1', port: DEBUG_PORT, path: '/json/new?about:blank', method: 'PUT' },
          (res) => {
            let d = '';
            res.on('data', (c) => (d += c));
            res.on('end', () => resolve(JSON.parse(d)));
          }
        );
        req.on('error', reject);
        req.end();
      });
      const { ws, send, once } = await connect(target.webSocketDebuggerUrl);
      await send('Page.enable');
      await send('Emulation.setScriptExecutionDisabled', { value: !WITH_JS });
      // Viewport de altura normal: uma janela de 9000px inflaria o `min-h-screen` do Hero.
      await send('Emulation.setDeviceMetricsOverride', {
        width: w,
        height: VIEWPORT_H,
        deviceScaleFactor: 1,
        mobile: w < 768,
      });
      const loaded = Promise.race([once('Page.loadEventFired'), wait(30000)]);
      await send('Page.navigate', { url });
      await loaded;
      await wait(2500); // fontes/CDNs de ícones e, com JS, hidratação

      // Com JS desligado na página o Runtime.evaluate do CDP continua funcionando.
      const { result } = await send('Runtime.evaluate', { expression: PROBE, returnByValue: true });
      const probe = JSON.parse(result.value);
      if (probe.docHeight > h) {
        console.error(`${name}: documento tem ${probe.docHeight}px, maior que a captura fixa de ${h}px.`);
        process.exitCode = 1;
      }
      const { data } = await send('Page.captureScreenshot', {
        format: 'png',
        captureBeyondViewport: true,
        clip: { x: 0, y: 0, width: w, height: Math.min(h, probe.docHeight), scale: 1 },
      });
      fs.writeFileSync(path.join(targetDir, name), Buffer.from(data, 'base64'));
      console.log(`${name} (${w}x${Math.min(h, probe.docHeight)}) ${result.value}`);
      ws.close();
    }
  } finally {
    chrome.kill();
  }
  console.log(`${WITH_JS ? 'JS' : 'No-JS'} capture complete! → ${targetDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

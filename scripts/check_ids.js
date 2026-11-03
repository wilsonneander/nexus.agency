// Porta do dev server: PORT=<n> node scripts/check_ids.js (padrão 3008)
const PORT = process.env.PORT || 3008;
const http = require('http');

http.get(`http://localhost:${PORT}`, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const ids = [
      'home', 'about', 'service', 'project', 'contact',
      // âncoras dos links de Serviços do rodapé
      'planejamento-estrategico', 'gestao-trafego-pago', 'criacao-sites-landing-pages',
      'chatbots-automacao', 'relatorios-analise',
    ];
    console.log('Section #blog removed from HTML:', !data.includes('id="blog"'));
    ids.forEach(id => {
      console.log(`ID #${id} exists in HTML:`, data.includes(`id="${id}"`));
    });
  });
}).on('error', err => console.error(err));

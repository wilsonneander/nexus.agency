// Caminho do Chrome usado pelos scripts de captura.
// Sobrescreva com CHROME_PATH=<executável>; sem ela, usa o caminho padrão do sistema.
const DEFAULTS = {
  darwin: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  win32: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  linux: 'google-chrome',
};

module.exports = process.env.CHROME_PATH || DEFAULTS[process.platform] || DEFAULTS.linux;

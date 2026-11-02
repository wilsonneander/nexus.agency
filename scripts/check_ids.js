const http = require('http');

http.get('http://localhost:3001', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const ids = ['home', 'about', 'service', 'project', 'blog', 'contact'];
    ids.forEach(id => {
      console.log(`ID #${id} exists in HTML:`, data.includes(`id="${id}"`));
    });
  });
}).on('error', err => console.error(err));

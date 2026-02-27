const http = require('http');
const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Hello');
});
server.listen(3000, () => {
    console.log('Listening on 3000');
});
setTimeout(() => { console.log('Timeout'); }, 50000);

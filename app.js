const crypto = require('crypto');
const exec = require('child_process').exec;
const fs = require('fs');
const https = require('https');
const ssl_options = {
    key: fs.readFileSync('/YOUR_SSL_DIRECTORY/privkey.pem'),
    cert: fs.readFileSync('/YOUR_SSL_DIRECTORY/fullchain.pem'),
};
const secret = 'YOUR_GITHUB_WEBHOOK_SECRET';

https.createServer(ssl_options, function (req, res) {
    req.on('data', function (chunk) {
        let signature = 'sha1=' + crypto.createHmac('sha1', secret).update(chunk.toString()).digest('hex');

        if (req.headers['x-hub-signature'] === signature) {
            exec('git pull origin master');
        }
    });

    res.end();
}).listen(8080);

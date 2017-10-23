var https = require('https');

function _invokeDeviceCommand() {
    var options = {
        hostname: 'gmsmartcar-service.azurewebsites.net',
        port: 443,
        path: '/api/command',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    };

    console.log(options.path);
    var req = https.request(options, function(res) {
        console.log('Status: ' + res.statusCode);
        console.log('Headers: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (body) {
            console.log('Body: ' + body);
        });
    });

    req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
});

    // write data to request body
    req.write('');

    req.end();
}

module.exports = {
    invokeDeviceCommand: _invokeDeviceCommand
}
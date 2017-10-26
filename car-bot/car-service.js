var https = require('http');

const _hostname = 'localhost'; //'gmsmartcar-service.azurewebsites.net'
const _port = 8080; //443

function _getRequestOptions(_path, _method) {
    return {
        hostname: _hostname,
        port: _port,
        path: _path,
        method: _method,
        headers: {
            'Content-Type': 'application/json',
        }  
    }
}

function _requestCallback(res) {
    console.log('Status: ' + res.statusCode);
    console.log('Headers: ' + JSON.stringify(res.headers));
    
    res.setEncoding('utf8');
    res.on('data', function (body) {
        console.log('Body: ' + body);
    });
}

function _doRequest(_path, _method, _data) {
    var req = https.request(_getRequestOptions(_path, _method), _requestCallback);
    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });

    // write data to request body
    req.write(JSON.stringify(_data));
    req.end();
}

function _invokeDeviceCommand() {
    /*
    var options = {
        hostname: _hostname,
        port: _port,
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
    */
    var req = https.request(_getRequestOptions('/api/command', 'GET'), _requestCallback);

    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });

    // write data to request body
    req.write('');

    req.end();
}


function _playMusic(music) {
    var data = {
        action: 'playMusic',
        params: {
            music: 'when-i-meet-you'
        }
    };

    _doRequest('/api/command', 'POST', data);
}

module.exports = {
    invokeDeviceCommand: _invokeDeviceCommand,
    playMusic: _playMusic
}
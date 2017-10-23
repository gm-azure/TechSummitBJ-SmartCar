// This loads the environment variables from the .env file
require('dotenv-extended').load();
var carIoTSvc = require('./car-iot-service');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var apiRouter = express.Router();

//For application/json body
var jsonParser = bodyParser.json();
//For application/x-www-form-urlencoded body
var urlEncodedParser = bodyParser.urlencoded({extended: false});

var port = process.env.PORT || 8080;


//middleware to log all request
apiRouter.use(function(req, res, next){
    console.log(req.headers);
    next();
});

apiRouter.get('/', function(req, res){
    res.json({
        message: 'welcome to this smart car service.'
    });
});

apiRouter.route('/command').get(function(req, res){
    var data = {
        action: 'start'
    }
    
    var methodParams = {
        methodName: 'start',
        payload: JSON.stringify(data),
        timeoutInSeconds: 30
    };

    carIoTSvc.invokeDeviceMethod('smart-car-no-1', methodParams);


    res.json({message: 'command api'});
});

apiRouter.route('/message').get(function(req, res) {
    carIoTSvc.sendDeviceMessage('smart-car-no-1', 'smart-car-no-1-msg', 'hello smart car no.1');
    res.json({message: 'message api'});
});

app.use('/api', apiRouter);

app.route('/').get(function(req, res){
    res.send("Home page for smart car service.");
});

app.listen(port);

console.log('smart car service running on port: ' + port);



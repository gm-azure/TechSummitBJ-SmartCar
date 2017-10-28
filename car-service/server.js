// This loads the environment variables from the .env file
require('dotenv-extended').load();
var carIoTSvc = require('./car-iot-service');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var apiRouter = express.Router();

//For application/json body
var jsonParser = bodyParser.json();
//For application/x-www-form-urlencoded body
var urlEncodedParser = bodyParser.urlencoded({extended: false});

app.use(urlEncodedParser);
app.use(jsonParser);

const deviceId = process.env.IOTHUB_DEVICE_ID;
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

apiRouter.route('/command')
.get(function(req, res) {
    var data = {
        action: 'playMusic',
        params: {
            music: 'my-love-girl-2'
        }
    }
    
    var methodParams = {
        methodName: 'start',
        payload: JSON.stringify(data),
        timeoutInSeconds: 30
    };

    carIoTSvc.invokeDeviceMethod(deviceId, methodParams);


    res.json({message: 'command api'});
})

.post(function (req, res) {

    console.log(JSON.stringify(req.body));
    //var data = {
    //    action: req.body.action,
    //    params: req.body.params
    //}
    
    var methodParams = {
        methodName: 'start',
        payload: req.body, //JSON.stringify(req.body),
        timeoutInSeconds: 30
    };

    carIoTSvc.invokeDeviceMethod(deviceId, methodParams);

    res.json({message: 'command api - post'});
});

apiRouter.route('/message').get(function(req, res) {
    carIoTSvc.sendDeviceMessage(deviceId, 'smart-car-no-1-msg', 'hello smart car no.1');
    res.json({message: 'message api'});
});

app.use('/api', apiRouter);

app.route('/').get(function(req, res){
    //res.send("Home page for smart car service.");
    res.sendfile(path.join(__dirname+'/index.html'));
});

app.listen(port);

console.log('smart car service running on port: ' + port);



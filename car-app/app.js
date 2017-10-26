
require('dotenv-extended').load();

const Device = require('azure-iot-device');
const Client = Device.Client;
const Message = Device.Message;
const Protocol = require('azure-iot-device-mqtt').Mqtt;
const Led = require('./led');
//rpio使用物理Pin序号
const Pins = {
    Led: 12  //P12/GPIO18
};

const connStr = process.env.IOTHUB_DEVICE_CONNSTR;

function operationLogging(op) {
    return function doLog(err, res) {
        if (err) console.log(op + ' error: ' + err.toString());
        if (res) console.log(op + ' status: ' + res.constructor.name);
    }
}

var client = Client.fromConnectionString(connStr, Protocol);

function receiveCloudMessage(message) {
    console.log('IoT Hub Client: Receive message: ' + message.messageId + " Body: " + message.data);
    client.complete(message, operationLogging('receiveCloudMessage'));
}

function onStart(req, res){
    console.log('Invoke the method Start(' + JSON.stringify(req.payload) + ')');

    Led.on(Pins.Led);
    Led.delay(1000);
    Led.off(Pins.Led);

    res.send(200, 'Start successfully', operationLogging("DirectMethod onStart"));
}

//Initialize LED
Led.setup(Pins.Led);

client.open(function(error){
    if(error){
        console.log('IoT Hub Client: connect error: ' + err.message);
    }

    console.log('IoT Hub Client: connect successfully.');

    client.onDeviceMethod('start', onStart);

    client.on('message', receiveCloudMessage);
    /*
    setInterval(function (){
        var temperature = 20 + (Math.random() * 15);
        var humidity = 60 + (Math.random() * 20);            
        var data = JSON.stringify({ deviceId: client.deviceId, temperature: temperature, humidity: humidity });
        var message = new Message(data);
        message.properties.add('temperatureAlert', (temperature > 30) ? 'true' : 'false');
        console.log("Sending message: " + message.getData());
        client.sendEvent(message, operationLogging('deviceSendMsg'));
    }, 2000);
    */

});
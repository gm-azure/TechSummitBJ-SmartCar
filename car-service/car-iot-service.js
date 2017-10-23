require('dotenv-extended').load();
const Client = require('azure-iothub').Client;
const Message = require('azure-iot-common').Message;

const connStr = process.env.IOTHUB_CONNSTR;

function operationLogging(op) {
    return function doLog(err, res) {
        if (err) console.log(op + ' error: ' + err.toString());
        if (res) console.log(op + ' status: ' + res.constructor.name);
    }
}

var client = Client.fromConnectionString(connStr);

function _invokeDeviceMethod(deviceId, methodParams) {
    client.invokeDeviceMethod(deviceId, methodParams, function (error, result) {
        if (error) {
            console.error('Failed to invoke method \'' + methodName + '\': ' + err.message);
        } else {
            console.log(methodParams.methodName + ' on ' + deviceId + ':');
            console.log(JSON.stringify(result, null, 2));
        }
    })
}

function _sendDeviceMessage(deviceId, messageId, message) {
    var msg = new Message(message);
    msg.ack = 'full';
    msg.messageId = messageId;
    console.log('Sending message: ' + msg.getData());

    client.send(deviceId, msg, operationLogging('Car IoT Service: _sendDeviceMessage'));
}

function _receiveFeedback(err, receiver){
  receiver.on('message', function (msg) {
    console.log('Feedback message:')
    console.log(msg.getData().toString('utf-8'));
  });
}

client.open(function (error) {
    if (error) {
        console.error('Could not connect to IoT Hub: ', error.message);
        return;
    }

    console.log('Azure IoT Hub connected.');

    client.getFeedbackReceiver(_receiveFeedback);
});


module.exports = {
    invokeDeviceMethod: _invokeDeviceMethod,
    sendDeviceMessage: _sendDeviceMessage
}
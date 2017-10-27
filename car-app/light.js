const GPIO = require('rpio');  

const _Pins = {
    LightL: 36,    //GPIO16
    LightR: 40,    //GPIO21
};

module.exports = {
    setup: function () {
        GPIO.open(_Pins.LightL, GPIO.OUTPUT, GPIO.LOW);
        GPIO.open(_Pins.LightR, GPIO.OUTPUT, GPIO.LOW);
    },

    on: function () {
        GPIO.write(_Pins.LightL, GPIO.HIGH);
        GPIO.write(_Pins.LightR, GPIO.HIGH);
    },

    off: function () {
        GPIO.write(_Pins.LightL, GPIO.LOW);
        GPIO.write(_Pins.LightR, GPIO.LOW);
    }
}
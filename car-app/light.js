const GPIO = require('rpio');  

const _Pins = {
    LightL: 36,    //GPIO16
    LightR: 40,    //GPIO21
};

module.exports = {
    setup: function () {
        GPIO.open(LightL, GPIO.OUTPUT, GPIO.LOW);
        GPIO.open(LightR, GPIO.OUTPUT, GPIO.LOW);
    },

    on: function () {
        GPIO.write(LightL, GPIO.HIGH);
        GPIO.write(LightR, GPIO.HIGH);
    },

    off: function () {
        GPIO.write(LightL, GPIO.LOW);
        GPIO.write(LightR, GPIO.LOW);
    }
}
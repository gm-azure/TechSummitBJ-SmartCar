const GPIO = require('rpio');  

module.exports = {
    setup: function (pin) {
        GPIO.open(pin, GPIO.OUTPUT, GPIO.LOW);
    },

    on: function (pin) {
        GPIO.write(pin, GPIO.HIGH);
    },

    off: function (pin) {
        GPIO.write(pin, GPIO.LOW);
    },

    delay: function (ms) {
        GPIO.msleep(ms);
    }
}
const GPIO = require('pi-gpio');  

module.exports = {
    setup: function (pin) {
        GPIO.open(pin, 'output', function(err) {
            if (err) {
                console.log("GPIO-Led open failed.")
            }
            else {
                console.log("GPIO-Led open successfully.");
            }
        });
    },

    on: function (pin) {
        GPIO.write(pin, 1, function(err){});
    },

    off: function (pin) {
        GPIO.write(pin, 0, function(err){});
    }
}
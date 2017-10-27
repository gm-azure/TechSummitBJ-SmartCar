const GPIO = require('rpio');  

const _Pins = {
    MotorIN1: 12,    //GPIO18
    MotorIN2: 16,    //GPIO23
    MotorIN3: 18,    //GPIO24
    MotorIN4: 22,    //GPIO25
};

function _init() {
    GPIO.open(_Pins.MotorIN1, GPIO.OUTPUT, GPIO.HIGH);
    GPIO.open(_Pins.MotorIN2, GPIO.OUTPUT, GPIO.HIGH);
    GPIO.open(_Pins.MotorIN3, GPIO.OUTPUT, GPIO.HIGH);
    GPIO.open(_Pins.MotorIN4, GPIO.OUTPUT, GPIO.HIGH);
};

function _start() {
    GPIO.write(_Pins.MotorIN1, GPIO.HIGH);
    GPIO.write(_Pins.MotorIN2, GPIO.HIGH);
    GPIO.write(_Pins.MotorIN3, GPIO.HIGH);
    GPIO.write(_Pins.MotorIN4, GPIO.HIGH);
}

function _stop() {
    GPIO.write(_Pins.MotorIN1, GPIO.LOW);
    GPIO.write(_Pins.MotorIN2, GPIO.LOW);
    GPIO.write(_Pins.MotorIN3, GPIO.LOW);
    GPIO.write(_Pins.MotorIN4, GPIO.LOW);
};

function _goForward() {
    GPIO.write(_Pins.MotorIN1, GPIO.HIGH);
    GPIO.write(_Pins.MotorIN2, GPIO.LOW);
    GPIO.write(_Pins.MotorIN3, GPIO.HIGH);
    GPIO.write(_Pins.MotorIN4, GPIO.LOW);
};

function _goBackward() {
    GPIO.write(_Pins.MotorIN1, GPIO.LOW);
    GPIO.write(_Pins.MotorIN2, GPIO.HIGH);
    GPIO.write(_Pins.MotorIN3, GPIO.LOW);
    GPIO.write(_Pins.MotorIN4, GPIO.HIGH);
};

function _turnLeft() {
    GPIO.write(_Pins.MotorIN1, GPIO.LOW);
    GPIO.write(_Pins.MotorIN2, GPIO.LOW);
    GPIO.write(_Pins.MotorIN3, GPIO.HIGH);
    GPIO.write(_Pins.MotorIN4, GPIO.LOW);
};

function _turnRight() {
    GPIO.write(_Pins.MotorIN1, GPIO.HIGH);
    GPIO.write(_Pins.MotorIN2, GPIO.LOW);
    GPIO.write(_Pins.MotorIN3, GPIO.LOW);
    GPIO.write(_Pins.MotorIN4, GPIO.LOW);
};

module.exports = {
    init: _init,
    start: _start,
    stop: _stop,
    goForward: _goForward,
    goBackward: _goBackward,
    turnLeft: _turnLeft,
    turnRight: _turnRight
}
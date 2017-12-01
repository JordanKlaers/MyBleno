'use strict';


var Gpio = require('pigpio').Gpio,
led = new Gpio(17, {mode: Gpio.OUTPUT})
// led = new Gpio(17, {mode: Gpio.OUTPUT}),
// led = new Gpio(17, {mode: Gpio.OUTPUT}),

  led.pwmWrite(150);


var handleTheData = (data) =>{
  var number = Number(data)
  led.pwmWrite(number);
  console.log(number);
}

module.exports.handleTheData = handleTheData;

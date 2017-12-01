'use strict';


var Gpio = require('pigpio').Gpio,
led = new Gpio(17, {mode: Gpio.OUTPUT})
// led = new Gpio(17, {mode: Gpio.OUTPUT}),
// led = new Gpio(17, {mode: Gpio.OUTPUT}),

  led.pwmWrite(150);


var handleTheData = (data) =>{
  var number = Number(data)
  console.log(typeof number);
  console.log(number);
  led.pwmWrite(number);
}

module.exports.handleTheData = handleTheData;

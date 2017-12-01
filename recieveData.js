'use strict';


var Gpio = require('pigpio').Gpio,
led = new Gpio(17, {mode: Gpio.OUTPUT})
// led = new Gpio(17, {mode: Gpio.OUTPUT}),
// led = new Gpio(17, {mode: Gpio.OUTPUT}),

  led.pwmWrite(150);


var handleTheData = (data) =>{
  var number = Number(data)
  number = Math.floor(number);
  console.log(typeof number);
  console.log(number);
  led.pwmWrite(number);
  convertValue(number);
}



var convertValue = (value) => {
  rgbColor = hslToRgb(value, 100, 50)
  console.log("should be rgb: ", rgbColor);
}




function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

module.exports.handleTheData = handleTheData;

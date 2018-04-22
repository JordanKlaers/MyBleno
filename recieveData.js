'use strict';


var Gpio = require('pigpio').Gpio
var green = new Gpio(17, {mode: Gpio.OUTPUT})
var red = new Gpio(27, {mode: Gpio.OUTPUT})
var blue = new Gpio(22, {mode: Gpio.OUTPUT})

  green.pwmWrite(150);


var handleTheData = (data, LEDObject) =>{
	if (data == 'invert') {
		console.log('invert');
		invertFunction()
		uploadRGBValues();
		
		return;
	}
	else if (data.indexOf('led:') > -1 && LEDObject.connected) {
		console.log('got digital led data: ', data, "and board status is  true");
		digitalLED(data, LEDObject)
	}
	else {
		var number = Number(data)
  		number = Math.floor(number);
  		convertValue(number);
	}
  
}


async function digitalLED(data, LEDObject) {
	console.log('led strip update');
	var index = parseInt(data.split(":")[1])
	var update = () => {
		LEDObject.strip.off()
		LEDObject.strip.show()
		
		LEDObject.strip.pixel(index).color("rgb(0,50,0)");
		LEDObject.strip.show();
		
	}
	await update();
}








var invert = false

var invertFunction = () => {
	invert = !invert;
	redValue = Math.abs(redValue - 255);
	greenValue = Math.abs(greenValue - 255);
	blueValue = Math.abs(blueValue - 255);
	
}

var convertValue = (value) => {
//   console.log("inside covert value: ", value);
  var rgbColor = hslToRgb((value/360), 1, 0.5)
//   console.log("should be rgb: ", rgbColor);
  redValue = rgbColor[0]
  greenValue = rgbColor[1]
  blueValue = rgbColor[2]
  if (invert) {
	redValue = Math.abs(redValue - 255);
	greenValue = Math.abs(greenValue - 255);
	blueValue = Math.abs(blueValue - 255);
  }
  uploadRGBValues()
}

var redValue = 255;
var greenValue = 0;
var blueValue  = 0;

var uploadRGBValues = () => {
	console.log('updating color', invert);
	console.log('red: ', redValue);
	console.log('green: ', greenValue);
	console.log('blue: ', blueValue);
  	red.pwmWrite(redValue);
  	green.pwmWrite(greenValue);
  	blue.pwmWrite(blueValue);
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




var boardReady = false;



// var pixel = require("node-pixel");
// var firmata = require('firmata');

// var board = new firmata.Board("../dev/mmcblk0p1",function(){

//     strip = new pixel.Strip({
//         pin: 6, // this is still supported as a shorthand
//         length: 144,
//         firmata: board,
//         controller: "FIRMATA",

//     });

//     strip.on("ready", function() {
// 		boardReady = true;
// 		// do stuff with the strip here.
// 		// var n = 0;
// 		// setInterval(()=>{
			
// 		// 	strip.pixel(n).off()
// 		// 	if (n+1 == 144) {
// 				strip.pixel(2).color("rgb(0,5,0)");
// 		// 		n = 0
// 		// 	} else {
// 		// 		strip.pixel(n+1).color("rgb(5,0,0)");
// 		// 		n = n+1;
// 		// 	}
			
// 		// 	// strip.pixel(0).off();
// 		// 	// strip.shift(1, pixel.FORWARD, true);
// 		// 	// strip.pixel(0).color; // will now be nothing
// 		// 	// strip.pixel(1).color;
// 		// 	strip.show();
// 		// }, 200)
		
//     });
// });

module.exports.handleTheData = handleTheData;

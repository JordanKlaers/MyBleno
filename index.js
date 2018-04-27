var bleno = require('bleno');
var util = require('util');
var BlenoCharacteristic = bleno.Characteristic;
var BlenoPrimaryService = bleno.PrimaryService;
var recieveData = require("./recieveData.js");
const boardUtil = require("./board.js");
const command = require("./commands.js");
var pixel = require("node-pixel");
var five = require("johnny-five");
var Raspi = require("raspi-io");

const LEDObject = {
	connected: false,
	strip: null
};

const board = new five.Board({
  io: new Raspi()
});

board.on("ready", function() {
	var strip = new pixel.Strip({
        board: this,
        controller: "I2CBACKPACK",
        strips: [144] // 3 physical strips on pins 0, 1 & 2 with lengths 4, 6 & 8.
    });
    strip.on("ready", function() {
		LEDObject.connected = true;
		LEDObject.strip = strip;
		strip.off();
		console.log('strip is on');
	});
	LEDObject.connected = true;
	LEDObject.strip = strip;
});
board.on("error", function(err) {
	console.log('board error: POOP');
})

const WriteOnlyCharacteristic = function() {
	WriteOnlyCharacteristic.super_.call(this, {
		uuid: 'fffffffffffffffffffffffffffffff5',
		properties: ['write', 'writeWithoutResponse']
	})		
};

util.inherits(WriteOnlyCharacteristic, BlenoCharacteristic);


WriteOnlyCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
	var converted = data.toString('base64');
	var b = new Buffer(converted, 'base64');
	var value = b.toString();
	var expectation = fadePattern(value, LEDObject); // ADD TO QUE FUNCTION NEEDS TO BE CREATED
	Promise.resolve(expectation).then(()=> {
		callback(this.RESULT_SUCCESS);
	})
}








var stripQueue = [];
var queueIsEmpty = true;

function fadePattern(data, LEDObject) {
	if (data.indexOf('led:') > -1 && LEDObject.connected) {
		const index = parseInt(data.split(":")[1])
		stripQueue[index] = [2,4,6,8,13,20,30,50,70,70,50,30,20,13,8,6,4,2]
		if (queueIsEmpty) {
			load(LEDObject)
		}
	}
}

function load(LEDObject) {
	queueIsEmpty = false;
	while(!queueIsEmpty) {
		let moreToShow = false;
		for (let i = 0; i < stripQueue.length; i++) {
			if (stripQueue[i] !== undefined) {
				if (stripQueue[i].length >= 1) { //if there is at least one value left for an led show it
					console.log('did we get to writing the first led?');
					LEDObject.strip.pixel(i).color(`rgb(0,${stripQueue[i].shift()},0)`);	
					moreToShow = true;
				}
				else {
					LEDObject.strip.pixel(i).off()
					stripQueue[i] = undefined;
				}
			}
		}
		LEDObject.strip.show();
		if (!moreToShow) {
			queueIsEmpty = true;
		}
	}
}



















function SampleService() {
  	SampleService.super_.call(this, {
	    uuid: '00112233-4455-6677-8899-aabbccddeeff',
	    characteristics: [
      	new WriteOnlyCharacteristic(),
    	]
  	});
}

util.inherits(SampleService, BlenoPrimaryService);

bleno.on('stateChange', function(state) {
  console.log('_My bleno_: on -> stateChange: ' + state + ', address = ' + bleno.address);

  if (state === 'poweredOn') {
    bleno.startAdvertising('raspberrypi', ['fffffffffffffffffffffffffffffff0']);
  } else {
    bleno.stopAdvertising();
  }
});

// Linux only events /////////////////
bleno.on('accept', function(clientAddress) {
  console.log('_My bleno_: on -> accept, client: ' + clientAddress);

  bleno.updateRssi();
});

bleno.on('disconnect', function(clientAddress) {
  	console.log('_My bleno_: on -> disconnect, client: ' + clientAddress);
});

bleno.on('rssiUpdate', function(rssi) {
  	console.log('_My bleno_: on -> rssiUpdate: ' + rssi);
});
//////////////////////////////////////

bleno.on('mtuChange', function(mtu) {
  	console.log('_My bleno_: on -> mtuChange: ' + mtu);
});

bleno.on('advertisingStart', function(error) {
  	console.log('_My bleno_: on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

  	if (!error) {
    	bleno.setServices([
      		new SampleService()
    	]);
  	}
});

bleno.on('advertisingStop', function() {
	bleno.startAdvertising('raspberrypi', ['fffffffffffffffffffffffffffffff0']);
  	console.log('_My bleno_: on -> advertisingStop');
});

bleno.on('servicesSet', function(error) {

  console.log('_My bleno_: on -> servicesSet: ' + (error ? 'error ' + error : 'success'));
});

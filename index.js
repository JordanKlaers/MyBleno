var bleno = require('bleno');
var util = require('util');
var BlenoCharacteristic = bleno.Characteristic;
var BlenoPrimaryService = bleno.PrimaryService;
var recieveData = require("./recieveData.js");

console.log("util: ", util);

var WriteOnlyCharacteristic = function() {
  WriteOnlyCharacteristic.super_.call(this, {
    uuid: 'fffffffffffffffffffffffffffffff5',
    properties: ['write', 'writeWithoutResponse']
  });
};


util.inherits(WriteOnlyCharacteristic, BlenoCharacteristic);

WriteOnlyCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  var converted = data.toString('base64');
  var b = new Buffer(converted, 'base64');
  var result = b.toString();

  recieveData.handleTheData(result);
  callback(this.RESULT_SUCCESS);
};


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
  console.log('_My bleno_: on -> advertisingStop');
});

bleno.on('servicesSet', function(error) {

  console.log('_My bleno_: on -> servicesSet: ' + (error ? 'error ' + error : 'success'));
});

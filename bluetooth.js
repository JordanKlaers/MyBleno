function writeCharacteristic(that) {
	WriteOnlyCharacteristic.super_.call(that, {
		uuid: 'fffffffffffffffffffffffffffffff5',
		properties: ['write', 'writeWithoutResponse']
	})		
}

function writeRequest(data, offset, withoutResponse, callback, LEDObject) {
	var converted = data.toString('base64');
	var b = new Buffer(converted, 'base64');
	var result = b.toString();
	var expectation = // ADD TO QUE FUNCTION NEEDS TO BE CREATED
	Promise.resolve(expectation).then(()=> {
		callback(this.RESULT_SUCCESS);
	})	 
}

module.exports.bluetooth = {
	writeCharacteristic,
	writeRequest
};
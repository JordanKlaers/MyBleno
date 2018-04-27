const pixel = require("node-pixel");
const LEDObject = {
	connected: false,
	strip: null
};

function ready(that) {
	var strip = new pixel.Strip({
        board: that,
        controller: "I2CBACKPACK",
        strips: [144] // 3 physical strips on pins 0, 1 & 2 with lengths 4, 6 & 8.
    });
    strip.on("ready", function() {
		LEDObject.connected = true;
		LEDObject.strip = strip;
		strip.off();
		console.log('strip is on');
	});
	return {
		connected: true,
		strip: strip
	}
}

module.exports.board = {
	ready
}
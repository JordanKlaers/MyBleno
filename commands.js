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

function getFrame() {
	var frame = [];
	for (let i = 0; i < queue.length; i++) {
		if (queue[i].pattern.length > 0) {
			frame.push({
				queueIndex: i
				ledIndex: queue[i].led,
				value: queue.shift();
			})
		}
	}
}

module.exports.commands = {
	fadePattern
};
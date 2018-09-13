'use strict';

class Reason {

	constructor(lines) {
		this.lines = lines;
	}

	print(level) {
		const ind = Reason.INDENT.repeat(level);
		var i, line;
		for(i = 0; i < this.lines.length; ++i) {
			line = this.lines[i];
			if(line && line.print)
				line.print(level + 1);
			else
				console.log('%s%s', ind, line);
		}
	}

}

Reason.INDENT = '    ';

module.exports = Reason;

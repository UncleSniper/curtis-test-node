'use strict';

const EventEmitter = require('events');

var nextID = 0;

class TypeVar extends EventEmitter {

	constructor(title) {
		super();
		this.id = nextID++;
		this.title = title;
		this.singleConstraints = new Set();
		this.dualConstraints = new Set();
	}

}

module.exports = TypeVar;

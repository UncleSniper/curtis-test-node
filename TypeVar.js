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
		this.candidates = new Set();
	}

	addSingleConstraint(constraint) {
		if(this.singleConstraints.has(constraint))
			return false;
		this.singleConstraints.add(constraint);
		constraint.reapply();
		return true;
	}

	addDualConstraint(constraint) {
		if(this.dualConstraints.has(constraint))
			return false;
		this.dualConstraints.add(constraint);
		constraint.reapply();
		return true;
	}

}

module.exports = TypeVar;

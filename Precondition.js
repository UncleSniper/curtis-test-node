'use strict';

const EventEmitter = require('events');

class Precondition extends EventEmitter {

	constructor(subject) {
		super();
		this.subject = subject;
	}

}

class Disable {

	constructor(precondition, reason) {
		this.precondition = precondition
		this.reason = reason;
	}

}

Precondition.Disable = Disable;

module.exports = Precondition;

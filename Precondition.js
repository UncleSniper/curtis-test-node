'use strict';

class Precondition {

	constructor(subject) {
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

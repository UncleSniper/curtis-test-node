'use strict';

class TypeVarConstraint {

	constructor(constrainReason) {
		this.constrainReason = constrainReason;
		this.preconditions = new Set();
		this.disables = new Map();
	}

}

module.exports = TypeVarConstraint;

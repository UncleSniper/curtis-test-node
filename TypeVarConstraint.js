'use strict';

const Disableable = require('./Disableable.js');

class TypeVarConstraint extends Disableable {

	constructor(constrainReason) {
		super();
		this.constrainReason = constrainReason;
	}

}

module.exports = TypeVarConstraint;

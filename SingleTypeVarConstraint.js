'use strict';

const TypeVarConstraint = require('./TypeVarConstraint.js');

class SingleTypeVarConstraint extends TypeVarConstraint {

	constructor(typevar, constrainReason) {
		super(constrainReason);
		this.typevar = typevar;
		typevar.singleConstraints.add(this);
	}

}

module.exports = SingleTypeVarConstraint;

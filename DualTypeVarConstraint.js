'use strict';

const TypeVarConstraint = require('./TypeVarConstraint.js');

class DualTypeVarConstraint extends TypeVarConstraint {

	constructor(typevarA, typevarB, constrainReason) {
		super(constrainReason);
		this.typevarA = typevarA;
		this.typevarB = typevarB;
		typevarA.dualConstraints.add(this);
		typevarB.dualConstraints.add(this);
	}

}

module.exports = DualTypeVarConstraint;

'use strict';

class DualTypeVarConstraint {

	constructor(typevarA, typevarB) {
		this.typevarA = typevarA;
		this.typevarB = typevarB;
		typevarA.dualConstraints.add(this);
		typevarB.dualConstraints.add(this);
	}

}

module.exports = DualTypeVarConstraint;

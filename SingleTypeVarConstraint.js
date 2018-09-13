'use strict';

class SingleTypeVarConstraint {

	constructor(typevar) {
		this.typevar = typevar;
		typevar.singleConstraints.add(this);
	}

}

module.exports = SingleTypeVarConstraint;

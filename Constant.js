'use strict';

class Constant {

	constructor(initiator, name, typespec, initializer) {
		this.initiator = initiator;
		this.name = name;
		this.typespec = typespec;
		this.initializer = initializer;
	}

}

module.exports = Constant;

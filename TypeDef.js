'use strict';

class TypeDef {

	constructor(initiator, supertype) {
		this.initiator = initiator;
		this.supertype = supertype;
		this.fields = [];
	}

}

module.exports = TypeDef;

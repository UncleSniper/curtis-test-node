'use strict';

class FunDef {

	constructor(initiator, parameters, returnType, body) {
		this.initiator = initiator;
		this.parameters = parameters;
		this.returnType = returnType;
		this.body = body;
	}

}

class Parameter {

	constructor(name, type) {
		this.name = name;
		this.type = type;
	}

}

FunDef.Parameter = Parameter;

module.exports = FunDef;

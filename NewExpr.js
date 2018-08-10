'use strict';

class NewExpr {

	constructor(initiator, type, fields) {
		this.initiator = initiator;
		this.type = type;
		this.fields = fields;
	}

}

class FieldInitializer {

	constructor(name, assign, value) {
		this.name = name;
		this.assign = assign;
		this.value = value;
	}

}

NewExpr.FieldInitializer = FieldInitializer;

module.exports = NewExpr;

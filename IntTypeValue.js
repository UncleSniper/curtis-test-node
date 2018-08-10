'use strict';

const TypeValue = require('./TypeValue.js');

class IntTypeValue extends TypeValue {

	constructor(context, value) {
		super(context);
		this.value = value;
	}

}

module.exports = IntTypeValue;

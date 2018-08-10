'use strict';

const TypeValue = require('./TypeValue.js');

class TypeTypeValue extends TypeValue {

	constructor(context, value) {
		super(context);
		this.value = value;
	}

}

module.exports = TypeTypeValue;

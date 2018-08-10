'use strict';

const TypeValue = require('./TypeValue.js');

class RecordTypeValue extends TypeValue {

	constructor(context, recordType) {
		super(context);
		this.recordType = recordType;
		this.fields = Object.create(null);
	}

}

module.exports = RecordTypeValue;

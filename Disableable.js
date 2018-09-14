'use strict';

const EventEmitter = require('events');

const Precondition = require('./Precondition.js');

class Disableable extends EventEmitter {

	constructor() {
		super();
		this.preconditions = new Set();
		this.disables = new Map();
	}

	get isDisabled() {
		return !!this.disables.size;
	}

	addPrecondition(precondition) {
		if(this.preconditions.has(precondition))
			return false;
		this.preconditions.add(precondition);
		const wasDisabled = this.isDisabled;
		this.evalPrecondition(precondition);
		const isDisabled = this.isDisabled;
		precondition.on('satisfiedChanged', this.handlePrecondition.bind(this));
		if(isDisabled != wasDisabled)
			this.emit('disabledChanged', this, isDisabled, precondition);
		return true;
	}

	evalPrecondition(precondition) {
		this.updatePrecondition(precondition, precondition.check());
	}

	updatePrecondition(precondition, reason) {
		if(reason)
			this.disables.set(precondition, new Precondition.Disable(precondition, reason));
		else
			this.disables.delete(precondition);
	}

	handlePrecondition(precondition, newDisableReason) {
		const wasDisabled = this.isDisabled;
		this.updatePrecondition(precondition, newDisableReason);
		const isDisabled = this.isDisabled;
		if(isDisabled != wasDisabled)
			this.emit('disabledChanged', this, isDisabled, precondition);
	}

}

module.exports = Disableable;

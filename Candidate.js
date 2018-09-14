'use strict';

const Disableable = require('./Disableable.js');

class Elimination {

	constructor(constraint, reason) {
		this.constraint = constraint;
		this.reason = reason;
	}

}

class Candidate extends Disableable {

	constructor(typevar, value) {
		super();
		this.typevar = typevar;
		this.value = value;
		this.eliminations = new Map();
	}

	get isEliminated() {
		return !!this.eliminations.size;
	}

	setEliminated(constraint, reason) {
		const wasEliminated = this.isEliminated;
		this.eliminations.set(constraint, reason);
		if(!wasEliminated)
			this.emit('eliminatedChanged', this, true, constraint);
	}

	unsetEliminated(constraint) {
		if(!this.eliminations.delete(constraint))
			return;
		if(!this.isEliminated)
			this.emit('eliminatedChanged', this, false, constraint);
	}

}

Candidate.Elimination = Elimination;

module.exports = Candidate;

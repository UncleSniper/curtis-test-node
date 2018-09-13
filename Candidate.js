'use strict';

class Candidate {

	constructor(typevar) {
		this.typevar = typevar;
		this.preconditions = new Set();
		this.disables = new Map();
		this.eliminations = new Map();
	}

}

class Elimination {

	constructor(constraint, reason) {
		this.constraint = constraint;
		this.reason = reason;
	}

}

Candidate.Elimination = Elimination;

module.exports = Candidate;

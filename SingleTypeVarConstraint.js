'use strict';

const TypeVarConstraint = require('./TypeVarConstraint.js');

class SingleTypeVarConstraint extends TypeVarConstraint {

	constructor(typevar, constrainReason) {
		super(constrainReason);
		this.typevar = typevar;
		typevar.addSingleConstraint(this);
	}

	reapply() {
		var candidate;
		for(candidate of this.typevar.candidates)
			this.applyTo(candidate);
	}

	applyTo(candidate) {
		if(this.isDisabled) {
			candidate.unsetEliminated(this);
			return;
		}
		const reason = this.eliminates(candidate);
		if(reason)
			candidate.setEliminated(this, reason);
		else
			candidate.unsetEliminated(this);
	}

}

module.exports = SingleTypeVarConstraint;

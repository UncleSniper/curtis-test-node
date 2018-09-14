'use strict';

const TypeVarConstraint = require('./TypeVarConstraint.js');
const Reason = require('./Reason.js');

class PeerReason {

	constructor(candidate, reason) {
		this.candidate = candidate;
		this.reason = reason;
	}

	toReason(index) {
		return new Reason([
			'#' + index + ': ' + this.candidate.value.toString(),
			'does not match because:',
			this.reason
		]);
	}

}

class DualTypeVarConstraint extends TypeVarConstraint {

	constructor(typevarA, typevarB, constrainReason) {
		super(constrainReason);
		this.typevarA = typevarA;
		this.typevarB = typevarB;
		typevarA.addDualConstraint(this);
		typevarB.addDualConstraint(this);
	}

	reapply() {
		var candidate;
		for(candidate of this.typevarA)
			this.applyMajor(candidate, this.typevarB, false);
		for(candidate of this.typevarB)
			this.applyMajor(candidate, this.typevarA, true);
	}

	applyMajor(candidate, otherTypevar, reverse) {
		if(!otherTypevar.candidates.size) {
			candidate.unsetEliminated(this);
			return;
		}
		const reasons = [];
		var peerCandidate, reason;
		for(peerCandidate of otherTypevar.candidates) {
			if(reverse)
				reason = this.eliminates(peerCandidate, candidate);
			else
				reason = this.eliminates(candidate, peerCandidate);
			if(reason)
				reasons.push(new PeerReason(peerCandidate, reason));
		}
		if(reasons.length < otherTypevar.candidates.size) {
			candidate.unsetEliminated(this);
			return;
		}
		const lines = [
			'There are no matching candidates for:',
			otherTypevar.title,
			'Considered candidates:'
		];
		var i;
		for(i = 0; i < reasons.length; ++i)
			lines.push(reasons[i].toReason(i));
		candidate.setEliminated(this, new Reason(lines));
	}

}

module.exports = DualTypeVarConstraint;

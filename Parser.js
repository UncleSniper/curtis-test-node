'use strict';

const Token = require('./Token.js');
const Constant = require('./Constant.js');
const DoBlock = require('./DoBlock.js');
const IntLiteral = require('./IntLiteral.js');
const FieldAccess = require('./FieldAccess.js');
const Call = require('./Call.js');
const TypeDef = require('./TypeDef.js');
const FieldDef = require('./FieldDef.js');
const FunDef = require('./FunDef.js');
const NewExpr = require('./NewExpr.js');
const NameRef = require('./NameRef.js');

const broken = {
	push: brokencb,
	end: brokencb
};

function brokencb() {
	return broken;
}

function unexpected(token, expected) {
	process.stderr.write('Syntax error: Expected ' + expected + " near '" + token.text + "' at "
			+ token.location.file + ':' + token.location.line + ':' + token.location.column + '\n');
	return broken;
}

function noEnd(expected, location) {
	process.stderr.write('Syntax error: Unexpected end of input, expected ' + expected + ' at '
			+ location.file + ':' + location.line + ':' + location.column + '\n');
	return broken;
}

function expect(type, description, next) {
	return {
		push: function(token) {
			if(token.type != type)
				return unexpected(token, description);
			return next.call(this, token);
		},
		end: noEnd.bind(null, description)
	};
}

function delimitedList(endType, endDescr, sepType, sepDescr, pieceDescr, isPiece, startPiece, submit) {
	var items = [];
	function afterPiece(piece) {
		items.push(piece);
		return {
			push: function(token) {
				if(token.type == endType)
					return submit.call(this, items);
				if(token.type != sepType)
					return unexpected(token, sepDescr + ' or ' + endDescr);
				return startPiece(afterPiece);
			},
			end: noEnd.bind(null, sepDescr + ' or ' + endDescr)
		};
	}
	return {
		push: function(token) {
			if(token.type == endType)
				return submit.call(this, items);
			if(!isPiece(token))
				return unexpected(token, pieceDescr + ' or ' + endDescr);
			return startPiece(afterPiece).push.call(this, token);
		},
		end: noEnd.bind(null, pieceDescr + ' or ' + endDescr)
	};
}

const toplevel = {
	push: function(token) {
		switch(token.type) {
			case Token.T_CONST:
				return startConst(token);
			case Token.T_DO:
				return startDoBlock(token);
			default:
				return unexpected(token, "'const' or 'do'");
		}
	},
	end: function() {
		return toplevel;
	}
};

function startConst(initiator) {
	return expect(Token.T_NAME, 'name', function(name) {
		return {
			push: function(token) {
				switch(token.type) {
					case Token.T_COLON:
						return startExpression(function(type) {
							return expect(Token.T_EQUAL, "'='", function() {
								return constInitializer(initiator, name, type);
							});
						});
					case Token.T_EQUAL:
						return constInitializer(initiator, name, null);
					default:
						return unexpected(token, "':' or '='");
				}
			},
			end: noEnd.bind(null, "':' or '='")
		};
	});
}

function constInitializer(initiator, name, type) {
	return startExpression(function(initializer) {
		this.items.push(new Constant(initiator, name, type, initializer));
		return toplevel;
	});
}

function startDoBlock(initiator) {
	return startExpression(function(expression) {
		this.items.push(new DoBlock(initiator, expression));
		return toplevel;
	});
}

function startExpression(submit) {
	return {
		push: function(token) {
			switch(token.type) {
				case Token.T_INT:
					return startPostfix(new IntLiteral(token), submit);
				case Token.T_NAME:
					return startPostfix(new NameRef(token), submit);
				case Token.T_LPAREN:
					return startExpression(function(expression) {
						return expect(Token.T_RPAREN, "')'", function() {
							return startPostfix(expression, submit);
						});
					});
				case Token.T_TYPE:
					return startType(token, submit);
				case Token.T_FUN:
					return startFun(token, submit);
				case Token.T_NEW:
					return startNew(token, submit);
				default:
					return unexpected(token, 'expression');
			}
		},
		end: noEnd.bind(null, 'expression')
	};
}

function isExpression(token) {
	switch(token.type) {
		case Token.T_LPAREN:
		case Token.T_NEW:
		case Token.T_FUN:
		case Token.T_TYPE:
		case Token.T_INT:
		case Token.T_NAME:
			return true;
		default:
			return false;
	}
}

function startPostfix(base, submit) {
	return {
		push: function(token) {
			switch(token.type) {
				case Token.T_DOT:
					return expect(Token.T_NAME, 'name', function(name) {
						return startPostfix(new FieldAccess(base, token, name), submit);
					});
				case Token.T_LPAREN:
					return delimitedList(Token.T_RPAREN, "')'", Token.T_COMMA, "','", 'expression',
							isExpression, startExpression, function(args) {
								return startPostfix(new Call(base, args), submit);
							});
				default:
					return submit.call(this, base).push.call(this, token);
			}
		},
		end: function(location) {
			return submit.call(this, base).end.call(this, location);
		}
	};
}

function startType(initiator, submit) {
	return {
		push: function(token) {
			switch(token.type) {
				case Token.T_LESS:
					return startExpression(function(supertype) {
						return expect(Token.T_LBRACE, "'{'", function() {
							return typeMembers(initiator, supertype, submit);
						});
					});
				case Token.T_LBRACE:
					return typeMembers(initiator, null, submit);
				default:
					return unexpected(token, "'<' or '{'");
			}
		},
		end: noEnd.bind(null, "'<' or '{'")
	};
}

function typeMembers(initiator, supertype, submit) {
	const rectype = new TypeDef(initiator, supertype);
	const again = {
		push: function(token) {
			switch(token.type) {
				case Token.T_RBRACE:
					return submit.call(this, rectype);
				case Token.T_NAME:
					return expect(Token.T_COLON, "':'", function() {
						return startExpression(function(ftype) {
							rectype.fields.push(new FieldDef(token, ftype));
							return again;
						});
					});
				default:
					unexpected(token, "field definition or '}'");
			}
		},
		end: noEnd.bind(null, "'}'")
	};
	return again;
}

function startFun(initiator, submit) {
	return expect(Token.T_LPAREN, "'('", function() {
		return delimitedList(Token.T_RPAREN, "')'", Token.T_COMMA, "','", 'parameter',
				token => token.type == Token.T_NAME, funParam, function(parameters) {
					return {
						push: function(token) {
							switch(token.type) {
								case Token.T_GREATER:
									return startExpression(function(returnType) {
										return expect(Token.T_EQUAL, "'='", function() {
											return funBody(initiator, parameters, returnType, submit);
										});
									});
								case Token.T_EQUAL:
									return funBody(initiator, parameters, null, submit);
								default:
									return unexpected(token, "'>' or '='");
							}
						},
						end: noEnd.bind(null, "'>' or '='")
					};
				});
	});
}

function funParam(submit) {
	return expect(Token.T_NAME, 'name', function(name) {
		return {
			push: function(token) {
				if(token.type != Token.T_COLON)
					return submit.call(this, new FunDef.Parameter(name, null)).push.call(this, token);
				return startExpression(function(type) {
					return submit.call(this, new FunDef.Parameter(name, type));
				});
			},
			end: function(location) {
				return submit.call(this, new FunDef.Parameter(name, null)).end.call(this, location);
			}
		};
	});
}

function funBody(initiator, parameters, returnType, submit) {
	return startExpression(function(body) {
		return submit.call(this, new FunDef(initiator, parameters, returnType, body));
	});
}

function startNew(initiator, submit) {
	return startExpression(function(srcType) {
		return expect(Token.T_LBRACE, "'{'", function() {
			return delimitedList(Token.T_RBRACE, "'}'", Token.T_COMMA, "','", 'field initializer',
					token => token.type == Token.T_NAME, fieldInit, function(fields) {
						return startPostfix(new NewExpr(initiator, srcType, fields), submit);
					});
		});
	});
}

function fieldInit(submit) {
	return expect(Token.T_NAME, 'name', function(name) {
		return expect(Token.T_EQUAL, "'='", function(assign) {
			return startExpression(function(value) {
				return submit.call(this, new NewExpr.FieldInitializer(name, assign, value));
			});
		});
	});
}

class Parser {

	constructor() {
		this.state = toplevel;
		this.items = [];
	}

	push(token) {
		this.state = this.state.push.call(this, token);
	}

	end(location) {
		this.state = this.state.end.call(this, location);
	}

}

module.exports = Parser;

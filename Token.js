'use strict';

const Location = require('./Location.js');

class Token {

	constructor(type, text, file, line, column) {
		this.type = type;
		this.text = text;
		this.location = new Location(file, line, column);
	}

}

Token.T_NAME = 0;
Token.T_LPAREN = 1;
Token.T_RPAREN = 2;
Token.T_INT = 3;
Token.T_EQUAL = 4;
Token.T_COLON = 5;
Token.T_COMMA = 6;
Token.T_CONST = 7;
Token.T_FUN = 8;
Token.T_LESS = 9;
Token.T_TYPE = 10;
Token.T_LBRACE = 11;
Token.T_RBRACE = 12;
Token.T_GREATER = 13;
Token.T_DO = 14;
Token.T_DOT = 15;

Token.TYPEMAP = {
	'const': Token.T_CONST,
	'fun': Token.T_FUN,
	'type': Token.T_TYPE,
	'do': Token.T_DO
};

module.exports = Token;

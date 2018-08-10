'use strict';

const EventEmitter = require('events');

const Token = require('./Token.js');
const Location = require('./Location.js');

const ST_NONE = 0;
const ST_NAME = 1;
const ST_INT = 2;

class Lexer extends EventEmitter {

	constructor(file) {
		super();
		this.state = ST_NONE;
		this.buffer = '';
		this.broken = false;
		this.file = file;
		this.line = 1;
		this.column = 1;
		this.start = null;
	}

	push(text) {
		if(this.broken)
			return;
		var i, c;
		for(i = 0; i < text.length; ++i) {
			c = text[i];
			switch(this.state) {
				case ST_NONE:
					this.start = this.column;
					switch(c) {
						case ' ':
						case '\r':
						case '\n':
						case '\t':
							break;
						case '(':
							this._emitToken(Token.T_LPAREN, '(');
							break;
						case ')':
							this._emitToken(Token.T_RPAREN, ')');
							break;
						case '=':
							this._emitToken(Token.T_EQUAL, '=');
							break;
						case ':':
							this._emitToken(Token.T_COLON, ':');
							break;
						case ',':
							this._emitToken(Token.T_COMMA, ',');
							break;
						case '<':
							this._emitToken(Token.T_LESS, '<');
							break;
						case '{':
							this._emitToken(Token.T_LBRACE, '{');
							break;
						case '}':
							this._emitToken(Token.T_RBRACE, '}');
							break;
						case '>':
							this._emitToken(Token.T_GREATER, '>');
							break;
						case '.':
							this._emitToken(Token.T_DOT, '.');
							break;
						default:
							if((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')) {
								this.buffer = c;
								this.state = ST_NAME;
							}
							else if(c >= '0' && c <= '9') {
								this.buffer = c;
								this.state = ST_INT;
							}
							else
								this._unexpected(c);
							break;
					}
					break;
				case ST_NAME:
					if((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z'))
						this.buffer += c;
					else {
						this.state = ST_NONE;
						this._emitToken(Token.T_NAME, null);
						--i;
						continue;
					}
					break;
				case ST_INT:
					if(c >= '0' && c <= '9')
						this.buffer += c;
					else {
						this.state = ST_NONE;
						this._emitToken(Token.T_INT, null);
						--i;
						continue;
					}
					break;
				default:
					this.broken = true;
					throw new Error('Unrecognized lexer state: ' + this.state);
			}
			if(c == '\n') {
				++this.line;
				this.column = 1;
			}
			else
				++this.column;
		}
	}

	end() {
		if(this.broken)
			return;
		try {
			switch(this.state) {
				case ST_NONE:
					break;
				case ST_NAME:
					this._emitToken(Token.T_NAME, null);
					break;
				case ST_INT:
					this._emitToken(Token.T_INT, null);
					break;
				default:
					this.broken = true;
					throw new Error('Unrecognized lexer state: ' + this.state);
			}
		}
		finally {
			this.state = ST_NONE;
			this.buffer = '';
		}
		this.emit('end');
	}

	_unexpected(c) {
		this.broken = true;
		process.stderr.write('Lexical error: Unexpected character at ' + this.file + ':' + this.line
				+ ':' + this.column + ': ' + c + '\n');
	}

	_emitToken(type, text) {
		var ntype;
		try {
			if(text === null)
				text = this.buffer;
			if(type == Token.T_NAME) {
				ntype = Token.TYPEMAP[text];
				if(ntype)
					type = ntype;
			}
			this.emit('token', new Token(type, text, this.file, this.line, this.start));
		}
		finally {
			this.buffer = '';
		}
	}

	get location() {
		return new Location(this.file, this.line, this.column);
	}

}

module.exports = Lexer;

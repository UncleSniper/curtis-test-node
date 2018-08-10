const Lexer = require('./Lexer.js');
const Parser = require('./Parser.js');

const lex = new Lexer('<stdin>');
const par = new Parser();

process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => lex.push(chunk)).on('end', () => lex.end());

lex.on('token', token => par.push(token)).on('end', () => par.end(lex.location));

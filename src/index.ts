import {Lexer} from "./Lexer";

const lexer = new Lexer(`
code EQUAL_TO 5 PLUS 9 PLUS ( 4 minus 6 );
CONSOLE code;
`)
lexer.lexAnalysis()
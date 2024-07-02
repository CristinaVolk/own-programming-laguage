import {Lexer} from "./Lexer";
import {Parser} from "./Parser";

const lexer = new Lexer(`
code EQUAL_TO (5 PLUS 9) PLUS (4 MINUS 2);
CONSOLE code;
`)
lexer.lexAnalysis()

const parser = new Parser(lexer.tokenList)
const rootNode = parser.parseCode()
parser.run(rootNode)


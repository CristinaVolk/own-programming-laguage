import {Token, TokenType, tokenTypesList} from "../Token";
import {ExpressionNode} from "../AST/ExpressionNode";
import {StatementsNode} from "../AST/StatementsNode";


export class Parser {
    tokens: Array<Token>;
    position: number = 0
    scope: any = []

    constructor(tokens: Array<Token>) {
        this.tokens = tokens;
    }

    match(...expected: Array<TokenType>): Token | null {
        if (this.position < this.tokens.length) {
            const currentToken = this.tokens[this.position]
            if (
                expected.find(token => token.name === currentToken.type.name)
            ) {
                this.position += 1
                return currentToken
            }
        }
        return null;
    }

    require(...expected: Array<TokenType>): Token {
        const token = this.match(...expected)
        if (!token) {
            throw new Error(`The ${expected[0].name} is required in ${this.position} position`)
        }
        return token;
    }

    parseCode(): ExpressionNode {
        const root = new StatementsNode();
        while (this.position < this.tokens.length) {
            const codeStringNode = this.parseExpression()
            this.require(tokenTypesList.SEMICOLON)
            root.addNode(codeStringNode)
        }
    }
}
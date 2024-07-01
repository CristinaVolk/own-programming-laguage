import {Token, tokenTypesList} from "../Token";

export class Lexer {
    code: string;
    position: number = 0;
    tokenList: Array<Token> = []

    constructor(code: string) {
        this.code = code;
    }

    lexAnalysis(): Array<Token> {
        while(this.nextToken()) {
            console.log('Token')
        }

        this.tokenList = this.tokenList.filter(token => token.type.name !== tokenTypesList.SPACE.name);
        return this.tokenList
    }

    nextToken(): boolean {
        if (this.position >= this.code.length) {
            return false
        }

        const tokenTypesValues = Object.values(tokenTypesList)
        for (let i = 0; i < tokenTypesValues.length; i++) {
            const tokenType = tokenTypesValues[i];
            const regex = new RegExp('^' + tokenType.regex)
            const result = this.code.substring(this.position).match(regex)

            if (result && result[0]) {
                const token = new Token(tokenType, result[0], this.position)
                this.position += result[0].length;
                this.tokenList.push(token);
                console.log(token)
                return true;
            }
        }
        throw new Error(`There has been found an error in the ${this.position} position`)
    }
}
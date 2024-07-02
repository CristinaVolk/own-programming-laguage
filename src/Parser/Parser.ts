import {Token, TokenType, tokenTypesList} from "../Token";
import {ExpressionNode} from "../AST/ExpressionNode";
import {StatementsNode} from "../AST/StatementsNode";
import {NumbersNode} from "../AST/NumbersNode";
import {VariableNode} from "../AST/VariableNode";
import {BinOperationsNode} from "../AST/BinOperationsNode";
import {UnarOperationNode} from "../AST/UnarOperationNode";


export class Parser {
    tokens: Array<Token>;
    position: number = 0
    scope: any = []

    constructor(tokens: Array<Token>) {
        this.tokens = tokens;
    }

    match(...expectedTokens: Array<TokenType>): Token | null {
        if (this.position < this.tokens.length) {
            const currentToken = this.tokens[this.position]
            if (
                expectedTokens.find(token => token.name === currentToken.type.name)
            ) {
                this.position += 1
                return currentToken
            }
        }
        return null;
    }

    require(...expectedTokens: Array<TokenType>): Token {
        const token = this.match(...expectedTokens)
        if (!token) {
            throw new Error(`The ${expectedTokens[0].name} is required in ${this.position} position`)
        }
        return token;
    }

    parseVariableOrNumber(): ExpressionNode {
        const number = this.match(tokenTypesList.NUMBER);
        if (number !== null) {
            return new NumbersNode(number)
        }

        const variable = this.match(tokenTypesList.VARIABLE)
        if (variable !== null) {
            return new VariableNode(variable)
        }
        throw new Error(`there is a variable or number expected in the ${this.position} required`)
    }

    parsePrint(): ExpressionNode {
        const operatorLog = this.match(tokenTypesList.LOG)
        if (operatorLog !== null) {
            return new UnarOperationNode(operatorLog, this.parseFormula())
        }

        throw new Error(`There is an unary operator expected on the ${this.position} position `)
    }

    parseParentheses(): ExpressionNode {
        if (this.match(tokenTypesList.LPAR) != null) {
            const node = this.parseFormula();
            this.require(tokenTypesList.RPAR);
            return node;
        } else {
            return this.parseVariableOrNumber();
        }
    }

    parseFormula(): ExpressionNode {
        let leftNode = this.parseParentheses();
        let operator = this.match(tokenTypesList.MINUS, tokenTypesList.PLUS);
        while (operator !== null) {
            const rightNode = this.parseParentheses();
            leftNode = new BinOperationsNode(operator, leftNode, rightNode)
            operator = this.match(tokenTypesList.MINUS, tokenTypesList.PLUS)
        }
        return leftNode
    }

    parseExpression() {
        if (this.match(tokenTypesList.VARIABLE) == null) {
            const printNode = this.parsePrint()
            return printNode;
        }
        this.position -= 1;
        let variableNode = this.parseVariableOrNumber()
        const assignOperator = this.match(tokenTypesList.ASSIGN)
        if (assignOperator !== null) {
            const rightFormulaNode = this.parseFormula()
            const binaryNode = new BinOperationsNode(assignOperator, variableNode, rightFormulaNode)
            return binaryNode;
        }
        throw new Error(`There is an operator of '=' expected in the ${this.position} position `)
    }

    parseCode(): ExpressionNode {
        const root = new StatementsNode();
        while (this.position < this.tokens.length) {
            const codeStringNode = this.parseExpression()
            this.require(tokenTypesList.SEMICOLON)
            root.addNode(codeStringNode as ExpressionNode)
        }
        return root
    }

    run(node: ExpressionNode): any {
        if (node instanceof NumbersNode) {
            return parseInt(node.number.text)
        }

        if (node instanceof UnarOperationNode) {
            switch (node.operator.type.name) {
                case tokenTypesList.LOG.name: {
                    console.log(this.run(node.operand))
                    return;
                }
            }
        }

        if (node instanceof BinOperationsNode) {
            switch (node.operator.type.name) {
                case tokenTypesList.PLUS.name: {
                    return this.run(node.leftNode) + this.run(node.rightNode)
                }
                case tokenTypesList.MINUS.name: {
                    return this.run(node.leftNode) - this.run(node.rightNode)
                }
                case tokenTypesList.ASSIGN.name: {
                    const result = this.run(node.rightNode)
                    const variableNode = <VariableNode>node.leftNode
                    this.scope[variableNode.variable.text] = result
                    return result
                }
            }
        }

        if (node instanceof VariableNode) {
            if (this.scope[node.variable.text] !== null) {
                return this.scope[node.variable.text]
            } else {
                throw new Error(`The variable with the name: ${node.variable.text} has not been found `)
            }
        }

        if (node instanceof StatementsNode) {
            node.codeString.forEach(codeStr => {
                this.run(codeStr)
            })

            return
        }
        throw new Error('Error.')
    }
}
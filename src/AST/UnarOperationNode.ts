import {ExpressionNode} from "./ExpressionNode";
import {Token} from "../Token";

export class UnarOperationNode extends ExpressionNode {
    operation: Token
    operand: ExpressionNode


    constructor(operation: Token, operand: ExpressionNode) {
        super();
        this.operation = operation;
        this.operand = operand;
    }
}
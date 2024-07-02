import {ExpressionNode} from "./ExpressionNode";
import {Token} from "../Token";

export class BinOperationsNode extends ExpressionNode {
    operator: Token
    leftNode: ExpressionNode
    rightNode: ExpressionNode

    constructor(operator: Token, leftNode: ExpressionNode, rightNode: ExpressionNode) {
        super();
        this.operator = operator
        this.leftNode = leftNode
        this.rightNode = rightNode
    }
}
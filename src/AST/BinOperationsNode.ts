import {ExpressionNode} from "./ExpressionNode";
import {Token} from "../Token";

export class BinOperationsNode extends ExpressionNode {
    operation: Token
    leftNode: ExpressionNode
    rightNode: ExpressionNode

    constructor(operation: Token, leftNode: ExpressionNode, rightNode: ExpressionNode) {
        super();
        this.operation = operation
        this.leftNode = leftNode
        this.rightNode = rightNode
    }
}
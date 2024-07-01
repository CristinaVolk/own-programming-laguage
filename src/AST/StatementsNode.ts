import {ExpressionNode} from "./ExpressionNode";

export class StatementsNode extends ExpressionNode {
    codeString: Array<ExpressionNode> = []

    addNode(node: ExpressionNode) {
        this.codeString.push(node)
    }
}
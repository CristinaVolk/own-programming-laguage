import {ExpressionNode} from "./ExpressionNode";
import {Token} from "../Token";

export class NumbersNode extends ExpressionNode {
    number: Token

    constructor(number: Token) {
        super();
        this.number = number
    }
}
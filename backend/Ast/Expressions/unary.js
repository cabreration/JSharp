class Unary {
    constructor(operator, arg) {
        this.operator = operator; // Operator
        this.arg = arg; // Expression
    }

    getDot() {
        return '[label="UNARY EXPRESSION -> ' + this.operator.op + '"];\n';
    }

    getChildren() {
        return [ this.arg ];
    }

    getTypeOf() {
        return 'unary';
    }
}

module.exports.Unary =  Unary;
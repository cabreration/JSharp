class Binary {
    constructor(operator, arg1, arg2) {
        this.operator = operator; // Operator
        this.arg1 = arg1; // Expression
        this.arg2 = arg2; // Expression
    }

    getDot() {
        return '[label="BINARY EXPRESSION -> ' + this.operator.op + '"];\n';
    }

    getChildren() {
        return [ this.arg1, this.arg2 ];
    }

    getTypeOf() {
        return 'binary';
    }
}

module.exports.Binary =  Binary;
class Operator {
    constructor(name, op, row, column) {
        this.name = name; // String
        this.op = op; // String
        this.row = row; // Number
        this.column = column; // Number
    }
}

module.exports.Operator = Operator;
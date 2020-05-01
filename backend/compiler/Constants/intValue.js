class IntValue {
    constructor(value, row, column) {
        this.value = value; // number
        this.row = row;  // number
        this.column = column; // number
    }

    getDot() {
        return '[label=" integer: ' + this.value + '"];\n';
    }

    getChildren() {
        return [];
    }

    getTypeOf() {
        return 'int';
    }
}

module.exports.IntValue = IntValue;
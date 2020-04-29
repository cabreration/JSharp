class DoubleValue {
    constructor(value, row, column) {
        this.value = value; // number
        this.row = row;  // number
        this.column = column; // number
    }

    getDot() {
        return '[label=" double: ' + this.value + '"];\n';
    }

    getChildren() {
        return [];
    }
}

module.exports.DoubleValue = DoubleValue;
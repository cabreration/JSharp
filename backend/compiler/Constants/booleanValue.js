class BooleanValue {
    constructor(value, row, column) {
        this.value = value; // bool
        this.row = row;  // number
        this.column = column; // number
    }

    getDot() {
        return '[label=" boolean: ' + this.value + '"];\n';
    }

    getChildren() {
        return [];
    }
}

module.exports.BooleanValue = BooleanValue;
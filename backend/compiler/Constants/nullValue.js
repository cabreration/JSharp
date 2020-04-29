class NullValue {
    constructor(row, column) {
        this.row = row; // Number
        this.column = column; // Number
    }

    getChildren() {
        return [];
    }

    getDot() {
        return '[label="null"];\n';
    }
}

module.exports.NullValue= NullValue;
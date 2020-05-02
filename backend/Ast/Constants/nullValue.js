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

    getTypeOf() {
        return 'null';
    }
}

module.exports.NullValue= NullValue;
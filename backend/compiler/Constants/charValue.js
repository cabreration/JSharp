class CharValue {
    constructor(value, row, column) {
        this.value = value; // char or number
        this.row = row;  // number
        this.column = column; // number
    }

    getDot() {
        return '[label=" char: ' + this.value + '"];\n';
    }

    getChildren() {
        return [];
    }
}

module.exports.CharValue = CharValue;
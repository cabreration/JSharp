class Identifier {
    constructor(id, row, column) {
        this.id = id; // String
        this.row = row; // Number
        this.column = column; // Number
    }

    getChildren() {
        return [];
    }

    getDot() {
        return '[label="' + this.id + '"];\n';
    }
}

module.exports.Identifier = Identifier;
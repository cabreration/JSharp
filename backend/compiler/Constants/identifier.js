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

    getTypeOf() {
        return 'identifier';
    }
}

module.exports.Identifier = Identifier;
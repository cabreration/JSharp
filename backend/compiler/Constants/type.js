class Type {
    constructor(name, row, column, arrayFlag) {
        this.name = name; // String
        this.row = row; // Number
        this.column = column; // Number
        this.arrayFlag = arrayFlag; // Boolean
    }

    getDot() {
        return '[label="TYPE: ' + this.arrayFlag ? this.name+'[]' : this.name +  '"];\n';
    }

    getChildren() {
        return [];
    }
}

module.exports.Type = Type;
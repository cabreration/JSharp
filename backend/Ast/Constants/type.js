class Type {
    constructor(name, row, column, arrayFlag) {
        this.name = name; // String
        this.row = row; // Number
        this.column = column; // Number
        this.arrayFlag = arrayFlag; // Boolean
    }

    getDot() {
        return '[label="TYPE: ' + this.name +  '"];\n';
    }

    getChildren() {
        return [];
    }

    getTypeOf() {
        return 'type';
    }
}

module.exports.Type = Type;
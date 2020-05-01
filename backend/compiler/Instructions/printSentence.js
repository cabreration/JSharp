class PrintSentence {
    constructor(value, row, column) {
        this.value = value; // expression
        this.row = row; // number
        this.column = column; // number
    }

    getDot() {
        return '[label="PRINT"];\n';
    }

    getChildren() {
        return [ this.value ]
    }

    getTypeOf() {
        return 'printsentence';
    }
}

module.exports.PrintSentence = PrintSentence;
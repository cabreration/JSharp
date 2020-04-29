class ContinueSentence {
    constructor(row, column) {
        this.row = row;
        this.column = column;
    }

    getDot() {
        return '[label="CONTINUE"];\n';
    }

    getChildren() {
        return [];
    }
}

module.exports.ContinueSentence = ContinueSentence;
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

    getTypeOf() {
        return 'continuesentence';
    }
}

module.exports.ContinueSentence = ContinueSentence;
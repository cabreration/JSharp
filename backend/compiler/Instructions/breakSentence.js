class BreakSentence {
    constructor(row, column) {
        this.row = row;
        this.column = column;
    }

    getDot() {
        return '[label="BREAK"];\n';
    }

    getChildren() {
        return [];
    }
}

module.exports.BreakSentence = BreakSentence;
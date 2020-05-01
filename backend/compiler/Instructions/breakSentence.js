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

    getTypeOf() {
        return 'breaksentence';
    }
}

module.exports.BreakSentence = BreakSentence;
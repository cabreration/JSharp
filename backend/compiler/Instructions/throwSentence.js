class ThrowSentence {

    constructor(call, row, column) {
        this.call = call;
        this.row = row;
        this.column = column;
    }

    getDot() {
        return '[label="THROW SENTENCE"];\n';
    }

    getChildren() {
        return [ this.call.id ];
    }

    getTypeOf() {
        return 'throwsentence';
    }
}

module.exports.ThrowSentence = ThrowSentence;
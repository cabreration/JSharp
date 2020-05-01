class DowhileSentence {
    constructor(sentences, condition, row, column) {
        this.condition = condition; // nodelist -> [ condition ]
        this.sentences = sentences; // nodelist -> [ instructions ]
        this.row = row; // number
        this.column = column; // number
    }

    getDot() {
        return '[label="DO-WHILE SENTENCE"];\n';
    }

    getChildren() {
        return [ this.sentences, this.condition ]
    }

    getTypeOf() {
        return 'dowhilesentence';
    }
}

module.exports.DowhileSentence = DowhileSentence;
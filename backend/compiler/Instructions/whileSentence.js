class WhileSentence {
    constructor(condition, sentences, row, column) {
        this.condition = condition; // nodelist -> [ condition ]
        this.sentences = sentences; // nodelist -> [ sentences ]
        this.row = row; // number
        this.column = column; // number
    }

    getDot() {
        return '[label="WHILE SENTENCE"];\n';
    }

    getChildren() {
        return [ this.condition, this.sentences ]
    }

    getTypeOf() {
        return 'whilesentence';
    }
}

module.exports.WhileSentence = WhileSentence;
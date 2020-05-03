class TryCatchSentence {

    constructor(trySentences, exception, catchSentences, row, column) {
        this.trySentences = trySentences; //nodelist -> [ sentences ]
        this.exception = exception; // varT5
        this.catchSentences = catchSentences; //nodelist -> [ instructions ]
        this.row = row; // number
        this.column = column // number;
    }

    getDot() {
        return '[label="TRY-CATCH SENTENCE"];\n';
    }

    getChildren() {
        return [ this.trySentences, this.exception, this.catchSentences ];
    }

    getTypeOf() {
        return 'trycatchsentence';
    }
}

module.exports.TryCatchSentence = TryCatchSentence;
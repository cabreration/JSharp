class IfSentence {
    constructor(condition, sentences, elseSentence, row, column) {
        this.condition = condition; // nodelist -> [ expression ]
        this.sentences = sentences; // [ instruction ] -> nodelist
        this.elseSentence = elseSentence; // IfSentence     
        this.row = row; // number
        this.column = column; // number
    }

    getDot() {
        if (this.elseSentence == null && this.condition == null)
            return '[label="ELSE SENTENCE"];\n';
        else
            return '[label="IF SENTENCE"];\n';
    }

    getChildren() {
        if (this.elseSentence == null && this.condition == null) // else
            return [ this.sentences ]
        else if (this.elseSentence == null && this.condition != null) //if wo else
            return [ this.condition, this.sentences ];
        else 
            return [ this.condition, this.sentences, this.elseSentence ];
    }

    getTypeOf() {
        if (this.elseSentence == null && this.condition == null)
            return 'elsesentence';
        else
            return 'ifsentence';
    }
}

module.exports.IfSentence = IfSentence;
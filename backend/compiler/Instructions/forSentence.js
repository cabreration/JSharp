class ForSentence {

    constructor(start, middle, end, sentences, row, column) {
        this.start = start;  // nodelist -> []
        this.middle = middle; // nodeList -> []
        this.end = end; // nodelist -> []
        this.sentences = sentences; // nodelist => [ sentences ]
        this.row = row; // number
        this.column = column; // number
    }

    getDot() {
       return '[label="FOR SENTENCE"];\n';
    }

    getChildren() {
        return [ this.start, this.middle, this.end, this.sentences ]
    }

    getTypeOf() {
        return 'forsentence';
    }
}

module.exports.ForSentence = ForSentence;
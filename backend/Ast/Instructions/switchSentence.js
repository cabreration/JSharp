class SwitchSentence {
    constructor(condition, cases, row, column) {
        this.condition = condition; // nodelist -> [ expression ]
        this.cases = cases; // [ cases ] -> nodelist 
        this.row = row; // number
        this.column = column; // number
    }

    getDot() {
        return '[label="SWITCH SENTENCE"];\n';
    }

    getChildren() {
        return [ this.condition, this.cases ]
    }

    getTypeOf() {
        return 'switchsentence';
    }
}

module.exports.SwitchSentence = SwitchSentence;
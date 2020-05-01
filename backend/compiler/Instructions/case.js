class Case {
    constructor(value, sentences, row, column) {
        this.value = value; // nodelist -> [ expression ]
        this.sentences = sentences; // [ sentences ] -> nodelist 
        this.row = row; // number
        this.column = column; // number
    }

    getDot() {
        if (value != null)
            return '[label="CASE"];\n';
        else
            return '[label="DEFAULT"];\n';
    }

    getChildren() {
        if (this.value == null)
            return [ this.sentences ];
        else 
            return [ this.value, this.sentences ]
    }

    getTypeOf() {
        if (this.value != null)
            return 'case';
        else 
            return 'default';
    }
}

module.exports.Case = Case;
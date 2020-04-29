class ReturnSentence {
    constructor(value, row, column) {
        this.value = value;
        this.row = row;
        this.column = column;
    }

    getDot() {
        return '[label="RETURN"];\n';
    }

    getChildren() {
        if (this.value != null)
            return [ this.value ];
        else 
            return [];
    }
}

module.exports.ReturnSentence = ReturnSentence;
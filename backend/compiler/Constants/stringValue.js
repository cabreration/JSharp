class StringValue {
    constructor(value, row, column) {
        this.value = value;
        this.row = row; 
        this.column = column;
    }

    getDot() {
        return '[label=" string: ' + this.value + '"];\n';
    }

    getChildren() {
        return [];
    }
}

module.exports.StringValue = StringValue;
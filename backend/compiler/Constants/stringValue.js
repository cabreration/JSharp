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

    getTypeOf() {
        return 'string';
    }
}

module.exports.StringValue = StringValue;
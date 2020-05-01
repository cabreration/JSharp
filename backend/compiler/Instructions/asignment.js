class Asignment {
    constructor(id, accessList, expression, row, column) {
        this.id = id; // Identifier
        this.accessList = accessList; // nodelist -> [ accesslist ]
        this.expression = expression; // expression
        this.row = row; // number
        this.column = column; // number
    }

    getDot() {
        return '[label="ASIGNMENT"];\n';
    }

    getChildren() {
        if (this.accessList.length > 0)
            return [this.id, this.accessList, this.expression];
        else 
            return [this.id, this.expression]
    }

    getTypeOf() {
        return 'asignment';
    }
}

module.exports.Asignment = Asignment;
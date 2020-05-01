class Access {

    constructor(type, lead, row, column) {
        this.type = type; // 1 - simple, 2 - array, 3 - function
        this.lead = lead;
        this.row = row;
        this.column = column;
    }

    getChildren() {
        return [ this.lead ];
    }

    getDot() {
        return '[label="ACCESS"];\n';
    }

    getTypeOf() {
        return 'access';
    }
}

module.exports.Access = Access;
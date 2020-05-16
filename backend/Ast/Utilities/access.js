class Access {

    constructor(type, lead, row, column) {
        this.type = type; // 1 - attribute, 2 - array, 3 - function
        this.lead = lead; // could be an id, an integer or a function call
        this.row = row;
        this.column = column;
    }

    getChildren() {
        return [ this.lead ];
    }

    getDot() {
        return `[label="ACCESS: ${this.type === 1 || this.type === 3 ? '.'+this.lead : '['+this.lead+']'}"];\n`;
    }

    getTypeOf() {
        return 'access';
    }
}

module.exports.Access = Access;
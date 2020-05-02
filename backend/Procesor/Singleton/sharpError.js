class SharpError {
    constructor(type, description, row, column) {
        this.type = type;
        this.description = description;
        this.row = row;
        this.column = column;
    }
}

module.exports.SharpError = SharpError;
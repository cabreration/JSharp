class Symbol {
    constructor(id, role, type, position, envId, row, column) {
        this.id = id;
        this.role = role;
        this.type = type;
        this.position = position;
        this.envId = envId;
        this.row = row;
        this.column = column;
        this.constant = false;
    }

    shadow() {
        return new Symbol(this.id, this.role, this.type, -1, this.envId);
    }

    isConstant() {
        this.constant = true;
    }
}

module.exports.Symbol = Symbol;
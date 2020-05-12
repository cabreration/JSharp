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
        this.active = false;
        this.arraySize = 0;
    }

    shadow() {
        return new Symbol(this.id, this.role, this.type, -1, this.envId);
    }

    isConstant() {
        this.constant = true;
    }

    setActive() {
        this.active = true;
    }

    setSize(size) {
        this.arraySize = size;
    }
}

module.exports.Symbol = Symbol;
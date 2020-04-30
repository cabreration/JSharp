class Symbol {
    constructor(id, role, type, position, envId) {
        this.id = id;
        this.role = role;
        this.type = type;
        this.position = position;
        this.envId = envId;
    }

    shadow() {
        return new Symbol(this.id, this.role, this.type, -1, this.envId);
    }
}

module.exports.Symbol = Symbol;
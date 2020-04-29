class Symbol {
    constructor(id, role, type, position, envId) {
        this.id = id;
        this.role = role;
        this.type = type;
        this.position = position;
        this.envId = envId;
    }
}

module.exports.Symbol = Symbol;
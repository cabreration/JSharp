class Symbol {
    constructor(id, role, type, position, envId) {
        this.id = id;
        this.role = role;
        this.type = type;
        this.position = position;
        this.envId = envId;
        this.attributes = [];
    }

    shadow() {
        return new Symbol(this.id, this.role, this.type, -1, this.envId);
    }

    static generateStrcSymbol(id) {
        return new Symbol(id, 'global strc', 'strc', -1, envId, 'global');
    }

    addAttribute(type, id) {
        for (let i = 0; i < this.attributes.length; i++) {
            if (this.attributes[i].type === type && this.attributes[i].id === id) {
                return false;
            }
        }

        this.attributes.push({ type: type, id: id});
        return true;
    }
}

module.exports.Symbol = Symbol;
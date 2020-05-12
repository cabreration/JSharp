class Parameter {
    constructor(type, identifier) {
        this.identifier = identifier; // Identifier
        this.type = type; // Type
    }

    getDot() {
        return '[label="PARAMETER"];\n';
    }

    getChildren() {
        return [this.identifier, this.type];
    }

    getTypeOf() {
        return 'parameter';
    }

    getTDC(env, label, temp) {}
}

module.exports.Parameter = Parameter;
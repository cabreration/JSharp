class Parameter {
    constructor(type, identifier) {
        this.identifier = identifier; // Identifier
        this.type = type; // Type
    }

    getDot() {
        return '[label="' + this.identifier.id + '"];\n';
    }

    getChildren() {
        return [];
    }
}

module.exports.Parameter = Parameter;
class Function {
    constructor(type, id, parameters, sentences) {
        this.type = type; // Type
        this.id = id; // Identifier
        this.parameters = parameters; // NodeList - Parameter 
        this.sentences = sentences; // NodeList - Sentence(if, while, for, etc);
    }

    getDot() {
        return '[label="FUNCTION"];\n';
    }

    getChildren() {
        return [ this.type, this.id, this.parameters, this.sentences ];
    }

    getTypeOf() {
        return 'function';
    }
}

module.exports.Function = Function;
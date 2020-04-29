class VarT4 {
    // global
    constructor(identifier, expression) {
        this.identifier = identifier; // Identifier
        this.expression = expression; // Expression
    }

    getDot() {
        return '[label="VARIABLE DECLARATION - T4"];\n';
    }

    getChildren() {
        return [ this.identifier, this.expression ];
    }
}

module.exports.VarT4 = VarT4;
class VarT3 {
    // const
    constructor(identifier, expression) {
        this.identifier = identifier; // Identifier
        this.expression = expression; // Expression
    }

    getDot() {
        return '[label="VARIABLE DECLARATION - T3"];\n';
    }

    getChildren() {
        return [ this.identifier, this.expression ];
    }

    getTypeOf() {
        return 'vart3';
    }
}

module.exports.VarT3 = VarT3;
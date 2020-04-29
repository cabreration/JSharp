class VarT2 {
    // var
    constructor(identifier, expression) {
        this.identifier = identifier; // Identifier
        this.expression = expression; // Expression
    }

    getDot() {
        return '[label="VARIABLE DECLARATION - T2"];\n';
    }

    getChildren() {
        return [ this.identifier, this.expression ];
    }
}

module.exports.VarT2 = VarT2;
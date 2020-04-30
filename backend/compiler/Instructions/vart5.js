class VarT5 {

    constructor(type, ids) {
        this.type = type; // Type
        this.ids = ids; // NodeList - Identifiers
    }

    getDot() {
        return '[label="VARIABLE DECLARATION - T4"];\n';
    }

    getChildren() {
        return [ this.type, this.ids ];
    }

    getTypeOf() {
        return 'vart5';
    }
}

module.exports.VarT5 = VarT5;
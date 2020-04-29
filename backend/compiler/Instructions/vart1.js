class VarT1 {

    constructor(type, ids, expression) {
        this.type = type; // Type
        this.ids = ids; // NodeList
        this.expression = expression; // Expression
    }

    getDot() {
        return '[label="VARIABLE DECLARATION - T1"];\n';
    }

    getChildren() {
        return [ this.type, this.ids, this.expression ];
    }
}

module.exports.VarT1 = VarT1;
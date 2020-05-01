class Call {
    constructor(id, expList) {
        this.id = id; // Identifier
        this.expList = expList; // nodeList -> [ expression, asignment ]
    }

    getDot() {
        return '[label="CALL"];\n';
    }

    getChildren() {
        if (this.expList.length > 0)
            return [ this.id, this.expList ];
        else 
            return [ this.id ]
    }

    getTypeOf() {
        return 'call';
    }
}

module.exports.Call = Call;
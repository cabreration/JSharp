class Attribute {
    
    constructor(type, identifier, expression) {
        this.type = type; //Type
        this.identifier = identifier; //Identifier
        this.expression = expression; // expression
    }

    getChildren() {
        if (this.expression == null)
            return [ this.type, this.identifier ];
        else 
            return [this.type, this.identifier, this.expression];
    }

    getDot() {
        return '[label="ATTRIBUTE"];\n';
    }

    getTypeOf() {
        return 'attribute';
    }
}

module.exports.Attribute = Attribute;
class Strc {

    constructor(identifier, attributes) {
        this.identifier = identifier; // Identifier
        this.attributes = attributes; //nodelist -> [ attributes ]
    }

    getChildren() {
        return [ this.identifier, this.attributes ];
    }

    getDot() {
        return '[label="STRC DEF"];\n';
    }

    getTypeOf() {
        return 'strc';
    }

}

module.exports.Strc = Strc;
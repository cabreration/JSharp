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

    validateAttributesAreNotRepeated() {
        let atts = this.attributes.getChildren();
        let length = atts.length;
        for (let i = 0; i < length; i++) {
            for (let j = i + 1; j < length; j++) {
                if (atts[i].identifier.id === atts[j].identifier.id) {
                    return {
                        res: false,
                        id: atts[i].identifier.id,
                        row: atts[j].identifier.row,
                        col: atts[j].identifier.column
                    }
                }
            }
        }
        return { res: true };
    }

    getAttributeInfo(id) {
        let atts = this.attributes.getChildren();
        for (let i = 0; i < atts.length; i++) {
            if (atts[i].identifier.id == id) {
                return {
                    position: i,
                    type: atts[i].type.name
                }
            }
        }
        return null;
    }

    getTDC(env, label, temp) {
        // TODO - validate it and store it in the Singleton list
    }

}

module.exports.Strc = Strc;
class Cast {
    constructor(type, expression) {
        this.type = type; // Type;
        this.expression = expression; // Expression
        this.byValue = false;
    }

    byValue() {
        this.byValue = true;
    }

    getChildren() {
        return [ this.type, this.expression ];
    }

    getDot() {
        return '[label="CAST"];\n';
    }

    getTypeOf() {
        return 'cast';
    }
}

module.exports.Cast = Cast;
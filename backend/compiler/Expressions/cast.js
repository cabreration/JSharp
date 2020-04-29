class Cast {
    constructor(type, expression) {
        this.type = type; // Type;
        this.expression = expression; // Expression
    }

    getChildren() {
        return [ this.type, this.expression ];
    }

    getDot() {
        return '[label="CAST"];\n';
    }
}

module.exports.Cast = Cast;
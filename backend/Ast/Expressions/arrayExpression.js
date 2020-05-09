class ArrayExpression {
    constructor(exp_list, type, size) {
        this.exp_list = exp_list; // nodeList -> [ expression ]
        this.type = type; // type
        this.size = size; // expression
    }

    getDot() {
        return '[label="ARRAY EXPRESSION"];\n';
    }

    getChildren() {
        if (this.exp_list != null) {
            return [ this.exp_list ];
        }
        else if (this.type != null) {
            return [ this.type, this.size ]
        }
        else {
            return [];
        }
    }

    getTypeOf() {
        return 'arrayexpression';
    }

    checkType(envId) {
        if (this.type != null) {
            return this.type.name;
        }
        else {

        }
    }
}

module.exports.ArrayExpression = ArrayExpression;
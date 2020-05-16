class ConditionTDC {    
    constructor(arg1, arg2, operator, row) {
        this.arg1 = arg1;
        this.arg2 = arg2;
        this.operator = operator;
        this.row = row;
    }

    print(flag) {
        return `(${this.arg1} ${this.operator} ${this.arg2})`
    }

    negate() {
        let neg;
        switch(this.operator) {
            case "<":
                neg = ">=";
                break;
            case "<=":
                neg = ">";
                break;
            case ">":
                neg = "<=";
                break;
            case ">=":
                neg = "<";
                break;
            case "<>":
                neg = '==';
                break;
            case "==":
                neg = "<>";
                break;
        }

        return `(${this.arg1} ${neg} ${this.arg2})`;
    }

    negateOperator() {
        switch(this.operator) {
            case ">":
                this.operator = "<=";
                break;
            case "<":
                this.operator = ">=";
                break;
            case ">=":
                this.operator = "<";
                break;
            case "<=":
                this.operator = ">";
                break;
            case "==":
                this.operator = "<>";
                break;
            case "<>":
                this.operator = "==";
                break;
        }
    }
}

module.exports.ConditionTDC = ConditionTDC;
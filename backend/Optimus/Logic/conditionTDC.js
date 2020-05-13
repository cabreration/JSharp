class ConditionTDC {    
    constructor(arg1, arg2, operator, row) {
        this.arg1 = arg1;
        this.arg2 = arg2;
        this.operator = operator;
    }

    print() {
        return `(${this.arg1} ${this.operator} ${this.arg2})`
    }
}

module.exports.ConditionTDC = ConditionTDC;
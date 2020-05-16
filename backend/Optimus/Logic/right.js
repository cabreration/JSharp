class Right {
    constructor(type, arg1, arg2, operator) {
        this.type = type;
        this.arg1 = arg1;
        this.arg2 = arg2;
        this.operator = operator;
    }

    getNormal() {
        switch(this.type) {
            case 1:
                return `- ${this.arg1}`
            case 2:
                let a = `${this.arg1} ${this.operator} ${this.arg2}`;
                return a;
            case 3:
                return `${this.arg1}`;
            case 4:
                return `stack[${this.arg1}]`;
            case 5:
                return `heap[${this.arg1}]`;
        }
    }
}

module.exports.Right = Right;
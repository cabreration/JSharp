class CallTDC {
    constructor(id, row) {
        this.id = id;
        this.row = row;
    }

    getTypeOf() {
        return 'call';
    }

    print() {
        return `call ${this.id};`;
    }
}

module.exports.CallTDC = CallTDC;
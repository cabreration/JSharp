class CallTDC {
    constructor(id, row) {
        this.id = id;
        this.row = row;
    }

    print() {
        return `call ${this.id};`;
    }
}

module.exports.CallTDC = CallTDC;
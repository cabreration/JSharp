class Jump {
    constructor(label, row) {
        this.label = label;
        this.row = row;
    }

    print() {
        return `goto ${this.label};`;
    }
}

module.exports.Jump = Jump;
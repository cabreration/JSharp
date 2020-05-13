class Jump {
    constructor(label, row) {
        this.label = label;
        this.row = row;
    }

    getTypeOf() {
        return 'jump';
    }

    print() {
        return `goto ${this.label};`;
    }
}

module.exports.Jump = Jump;
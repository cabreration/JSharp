class Destination {
    constructor(label, row) {
        this.label = label;
        this.row = row;
    }

    getTypeOf() {
        return 'destination';
    }

    print() {
        return `${this.label}:`;
    }
}

module.exports.Destination = Destination;
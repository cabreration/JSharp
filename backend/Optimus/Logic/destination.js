class Destination {
    constructor(label, row) {
        this.label = label;
        this.row = row;
    }

    getTypeOf() {
        return 'destination';
    }

    print(flag) {
        return `${this.label}:`;
    }
}

module.exports.Destination = Destination;
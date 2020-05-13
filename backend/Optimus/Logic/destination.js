class Destination {
    constructor(label, row) {
        this.label = label;
        this.row = row;
    }

    print() {
        return `${this.label}:`;
    }
}

module.exports.Destination = Destination;
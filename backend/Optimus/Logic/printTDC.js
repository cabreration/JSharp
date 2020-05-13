class PrintTDC {
    constructor(mode, value, row) {
        this.mode = mode;
        this.value = value;
        this.row = row;
    }

    getTypeOf() {
        return 'print';
    }

    print() {
        return `print(${this.mode}, ${this.value});`
    }
}

module.exports.PrintTDC = PrintTDC;
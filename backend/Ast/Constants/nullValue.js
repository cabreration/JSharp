class NullValue {
    constructor(row, column) {
        this.row = row; // Number
        this.column = column; // Number
    }

    getChildren() {
        return [];
    }

    getDot() {
        return '[label="null"];\n';
    }

    getTypeOf() {
        return 'null';
    }

    checkType(envId) {
        return 'strc';
    }

    getTDC(env, label, temp, h, p) {
        let updater = new Updater(env, label, temp, h, p, null);
        updater.addValue('0');
        return updater;
    }
}

module.exports.NullValue= NullValue;
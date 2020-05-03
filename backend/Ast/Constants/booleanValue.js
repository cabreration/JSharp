const Updater = require('../Utilities/updater').Updater;

class BooleanValue {
    constructor(value, row, column) {
        this.value = value; // bool
        this.row = row;  // number
        this.column = column; // number
    }

    getDot() {
        return '[label=" boolean: ' + this.value + '"];\n';
    }

    getChildren() {
        return [];
    }

    getTypeOf() {
        return 'boolean';
    }

    checkType(envId) {
        return 'boolean';
    }

    getTDC(env, label, temp, h, p) {
        let val = this.value ? '1' : '0';
        let updater = new Updater(env, label, temp, h, p, null);
        updater.addValue(`${val}`);
        updater.addType('boolean');
        return updater;
    }
}

module.exports.BooleanValue = BooleanValue;
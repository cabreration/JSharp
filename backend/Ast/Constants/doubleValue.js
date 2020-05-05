const Updater = require('../Utilities/updater').Updater;

class DoubleValue {
    constructor(value, row, column) {
        this.value = value; // number
        this.row = row;  // number
        this.column = column; // number
        this.byValue = false;
    }

    byValue() {
        this.byValue = true;
    }

    getDot() {
        return '[label=" double: ' + this.value + '"];\n';
    }

    getChildren() {
        return [];
    }

    getTypeOf() {
        return 'double';
    }

    checkType(envId) {
        return 'double';
    }

    getTDC(env, label, temp) {
        let updater = new Updater(env, label, temp, null);
        updater.addValue(`${this.value}`);
        updater.addType('double');
        return updater;
    }
}

module.exports.DoubleValue = DoubleValue;
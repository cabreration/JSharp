const Updater = require('../Utilities/updater').Updater;

class IntValue {
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
        return '[label=" integer: ' + this.value + '"];\n';
    }

    getChildren() {
        return [];
    }

    getTypeOf() {
        return 'int';
    }

    checkType(envId) {
        return 'int';
    }

    getTDC(env, label, temp) {
        let val = this.value;
        let updater = new Updater(env, label, temp, null);
        updater.addValue(`${val}`);
        updater.addType('int');
        return updater;
    }
}

module.exports.IntValue = IntValue;
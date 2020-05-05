class NullValue {
    constructor(row, column) {
        this.row = row; // Number
        this.column = column; // Number
        this.byValue = false;
    }

    byValue() {
        this.byValue = true;
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

    getTDC(env, label, temp) {
        let updater = new Updater(env, label, temp, null);
        updater.addValue('0');
        return updater;
    }
}

module.exports.NullValue= NullValue;
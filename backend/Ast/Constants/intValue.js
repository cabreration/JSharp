class IntValue {
    constructor(value, row, column) {
        this.value = value; // number
        this.row = row;  // number
        this.column = column; // number
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

    getTDC(env, label, temp, h, p) {
        let updater = new Updater(env, label, temp, h, p, null);
        updater.addValue(`${val}`);
        updater.addType('int');
        return updater;
    }
}

module.exports.IntValue = IntValue;
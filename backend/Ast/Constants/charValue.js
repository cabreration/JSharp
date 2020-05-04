class CharValue {
    constructor(value, row, column) {
        this.value = value; // char or number
        this.row = row;  // number
        this.column = column; // number
    }

    getDot() {
        return '[label=" char: ' + this.value + '"];\n';
    }

    getChildren() {
        return [];
    }

    getTypeOf() {
        return 'char';
    }

    checkType(envId) {
        return 'char';
    }

    getTDC(env, label, temp) {
        let val = val.charCodeAt(0);
        let updater = new Updater(env, label, temp, null);
        updater.addValue(`${val}`);
        updater.addType('char');
        return updater;
    }
}

module.exports.CharValue = CharValue;
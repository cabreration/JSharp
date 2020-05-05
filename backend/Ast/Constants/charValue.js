const Updater = require('../Utilities/updater').Updater;

class CharValue {
    constructor(value, row, column) {
        this.value = value; // char or number
        this.row = row;  // number
        this.column = column; // number
        this.byValue = false;
    }

    byValue() {
        this.byValue = true;
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

    scapeChar() {
        switch (this.value) {
            case '\\n':
                this.value = '\n';
                break;
            case '\\r':
                this.value = '\r';
                break;
            case '\\\\':
                this.value = '\\';
                break;
            case '\\t':
                this.value = '\t';
                break;
            case '\\"':
                this.value = "\"";
                break;
        }
    }

    getTDC(env, label, temp) {
        this.scapeChar();
        let val = this.value.charCodeAt(0);
        let updater = new Updater(env, label, temp, null);
        updater.addValue(`${val}`);
        updater.addType('char');
        return updater;
    }
}

module.exports.CharValue = CharValue;
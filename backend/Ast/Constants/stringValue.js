const Singleton = require('../../Procesor/Singleton/singleton').Singleton;
const Updater = require('../Utilities/updater').Updater;

class StringValue {
    constructor(value, row, column) {
        this.value = value;
        this.row = row; 
        this.column = column;
        this.byValue = false;
    }

    byValue() {
        this.byValue = true;
    }

    getDot() {
        return '[label=" string: ' + this.value + '"];\n';
    }

    getChildren() {
        return [];
    }

    getTypeOf() {
        return 'string';
    }

    checkType(envId) {
        return 'string';
    }

    scapeString() {
        this.value.replace('\\n', '\n');
        this.value.replace('\\\\', '\\');
        this.value.replace('\\t', '\t');
        this.value.replace('\\r', '\r');
        this.value.replace('\\"', '\"');
    }

    getTDC(env, label, temp) {
        let code = [];
        code.push(`t${temp} = h;`);
        this.scapeString();
        for (let i = 0; i < this.value.length; i++) {
            let char = this.value.charCodeAt(i);
            code.push(`heap[h] = ${char};`);
            code.push('h = h + 1;');
        }
        code.push(`heap[h] = 0;`);
        code.push('h = h + 1;');
        temp++;
        let updater = new Updater(env, label, temp, code.join('\n'));
        updater.addValue(`t${temp - 1}`);
        updater.addType('string');
        return updater;
    }
}

module.exports.StringValue = StringValue;
const Singleton = require('../../Procesor/Singleton/singleton').Singleton;
const Updater = require('../Utilities/updater').Updater;

class StringValue {
    constructor(value, row, column) {
        this.value = value;
        this.row = row; 
        this.column = column;
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

    getTDC(env, label, temp) {
        let code = [];
        code.push(`t${temp} = h;`);
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
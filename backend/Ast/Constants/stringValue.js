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

    getTDC(env, label, temp, h, p) {
        let firstH = h;
        let code = [];
        code.push(`t${temp} = h;`);
        for (let i = 0; i < this.value.length; i++) {
            let char = this.value.charCodeAt(i);
            code.push(`heap[h] = ${char};`);
            code.push('h = h + 1;');
            Singleton.heap[h] = char;
            h++;
        }
        code.push(`heap[h] = 0;`);
        Singleton.heap[h] = 0;
        code.push('h = h + 1;');
        h++;
        temp++;
        let updater = new Updater(env, label, temp, h, p, code.join('\n'));
        updater.addValue(`t${temp - 1}`);
        updater.addType('string');
        updater.addReference(firstH);
        return updater;
    }
}

module.exports.StringValue = StringValue;
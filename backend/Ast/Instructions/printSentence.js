const Singleton = require('../../Procesor/Singleton/singleton').Singleton;
const Updater = require('../Utilities/updater').Updater;

class PrintSentence {
    constructor(value, row, column) {
        this.value = value; // expression
        this.row = row; // number
        this.column = column; // number
    }

    getDot() {
        return '[label="PRINT"];\n';
    }

    getChildren() {
        return [ this.value ]
    }

    getTypeOf() {
        return 'printsentence';
    }

    getTDC(env, label, temp) {
        let code = [];
        // Validate expression
        let type = this.value.checkType(env);
        if (typeof(type) === 'object') {
            Singleton.insertError(type);
            return new Updater(env, label, temp, null);
        }

        // Translate the expression
        let updater = this.value.getTDC(env, label, temp);
        label = updater.label;
        temp = updater.temp;
        code.push(updater.code);

        // TODO - write code according to expression type
        switch(updater.type) {
            case 'string':
                code.push(`t${temp} = ${updater.value};`);
                temp++;
                code.push(`L${label}:`);
                label++;
                code.push(`t${temp} = heap[t${temp - 1}];`);
                code.push(`if (t${temp} == 0) goto L${label};`);
                code.push(`print("%c", t${temp});`);
                code.push(`t${temp - 1} = t${temp - 1} + 1;`);
                code.push(`goto L${label-1};`);
                code.push(`L${label}:`);
                label++;
                temp++;
                break;
            case 'int':
                code.push(`print("%i", ${updater.value});`);
                break;
            case 'double':
                code.push(`print("%d", ${updater.value});`);
                break;
            case 'char':
                code.push(`print("%c", ${updater.value});`)
                break;
            case 'boolean':
                code.push(`if (${updater.value} == 1) goto L${label};`);
                code.push(`print("%c", 102);`);
                code.push(`print("%c", 97);`);
                code.push('print("%c", 108);');
                code.push('print("%c", 115);');
                code.push('print("%c", 101);');
                code.push(`goto L${label + 1};`);
                code.push(`L${label}:`);
                label++;
                code.push('print("%c", 116);');
                code.push('print("%c", 114);');
                code.push('print("%c", 117);');
                code.push('print("%c", 101);');
                code.push(`L${label}:`);
                label++;
                break;
            default:
                // TODO - arrays or strcs
                break;
        }
        return new Updater(env, label, temp, code.join('\n'));
    }
}

module.exports.PrintSentence = PrintSentence;
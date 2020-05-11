const Updater = require('../Utilities/updater').Updater;
const Singleton = require('../../Procesor/Singleton/singleton').Singleton;
const SharpError = require('../../Procesor/Singleton/sharpError').SharpError;

class ReturnSentence {
    constructor(value, row, column) {
        this.value = value;
        this.row = row;
        this.column = column;
    }

    getDot() {
        return '[label="RETURN"];\n';
    }

    getChildren() {
        if (this.value != null)
            return [ this.value ];
        else 
            return [];
    }

    getTypeOf() {
        return 'returnsentence';
    }

    getTDC(env, label, temp) {
        let code = [];
        if (this.value == null) {
            code.push(`@@@@`);
            return new Updater(env, label, temp, code.join('\n'));
        }
        else {
            // evaluate the expression
            // code.push(`stack[p] = ${temp};`)
        }
    }
}

module.exports.ReturnSentence = ReturnSentence;
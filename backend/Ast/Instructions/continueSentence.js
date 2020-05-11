const Updater = require('../Utilities/updater').Updater;
const Singleton = require('../../Procesor/Singleton/singleton').Singleton;
const SharpError = require('../../Procesor/Singleton/sharpError').SharpError;

class ContinueSentence {
    constructor(row, column) {
        this.row = row;
        this.column = column;
    }

    getDot() {
        return '[label="CONTINUE"];\n';
    }

    getChildren() {
        return [];
    }

    getTypeOf() {
        return 'continuesentence';
    }

    getTDC(env, label, temp) {
        if (!Singleton.oneWords.loop) {
            Singleton.insertError(new SharpError('Semantico', 'La sentencia continue unicamente puede ser incluida en Ciclos', this.row, this.column));
            return new Updater(env, label, temp, null);
        }
        let code = [];
        code.push(`goto {{;`);
        return new Updater(env, label, temp, code.join('\n'));
    }
}

module.exports.ContinueSentence = ContinueSentence;
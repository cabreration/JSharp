const Updater = require('../Utilities/updater').Updater;
const Singleton = require('../../Procesor/Singleton/singleton').Singleton;
const SharpError = require('../../Procesor/Singleton/sharpError').SharpError;

class BreakSentence {
    constructor(row, column) {
        this.row = row;
        this.column = column;
    }

    getDot() {
        return '[label="BREAK"];\n';
    }

    getChildren() {
        return [];
    }

    getTypeOf() {
        return 'breaksentence';
    }

    getTDC(env, label, temp) {
        if (!Singleton.oneWords.loop && !Singleton.oneWords.choose) {
            Singleton.insertError(new SharpError('Semantico', 'La sentencia break unicamente puede ser incluida en un Switch o en un Ciclo', this.row, this.column));
            return new Updater(env, label, temp, null);
        }
        let code = [];
        code.push(`!!!!`);
        return new Updater(env, label, temp, code.join('\n'));
    }
}

module.exports.BreakSentence = BreakSentence;
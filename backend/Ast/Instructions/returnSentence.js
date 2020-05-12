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
            // check that this is not a void function
            if (Singleton.oneWords.arrow === 'void') {
                Singleton.insertError('Semantico', 'La funcion actual es de tipo void, no es posible retornar valores', this.row, this.column);
            }
            // evaluate the expression
            let expType = this.value.checkType(env);
            if (typeof(expType) === 'object') {
                Singleton.insertError(expType)
                return new Updater(env, label, temp, null);
            }

            if (expType != Singleton.oneWords.arrow) {
                if (Singleton.oneWords.arrow === 'double') {
                    if (expType != 'int' && expType != 'char') {
                        Singleton.insertError('Semantico', `Una funcion de tipo ${Singleton.oneWords.arrow} no puede retornar un valor de tipo ${expType}`, this.row, this.column);
                        return new Updater(env, label, temp, null);
                    }
                }
            }

            let expVal = this.value.getTDC(env, label, temp);
            if (expVal.value == null) {
                console.error('Error de progra en return.js');
                return new Updater(env, label, temp, null);
            }

            if (expVal.code != null) {
                code.push(expVal.code);
            }
            temp = expVal.temp;
            label = expVal.label;
            code.push(`stack[p] = ${expVal.value};`);
            code.push('@@@@');
            return new Updater(env, label, temp, code.join('\n'));
        }
    }
}

module.exports.ReturnSentence = ReturnSentence;
const SharpError = require('../../Procesor/Singleton/sharpError').SharpError;
const Singleton = require('../../Procesor/Singleton/singleton').Singleton;
const Updater = require('../Utilities/updater').Updater;

class Unary {
    constructor(operator, arg) {
        this.operator = operator; // Operator
        this.arg = arg; // Expression
        this.byValue = false;
    }

    byValue() {
        this.byValue = true;
    }

    getDot() {
        return '[label="UNARY EXPRESSION -> ' + this.operator.op + '"];\n';
    }

    getChildren() {
        return [ this.arg ];
    }

    getTypeOf() {
        return 'unary';
    }

    checkType(envId) {
        let argType = this.arg.checkType(envId);
        if (typeof(argType) === 'string') {
            if (this.operator.name === 'minus') {
                if (argType === 'int' || argType === 'double') {
                    return argType;
                }
                else {
                    return new SharpError('Semantico', 'Operacion invalida: no es posible aplicar el operador "-" a valores de tipo' + argType, this.operator.row, this.operator.column);
                }
            }
            else if (this.operator.name === 'not') {
                if (argType === 'boolean') {
                    return 'boolean'
                }
                else {
                    return new SharpError('Semantico', 'Operacion invalida: no es posible aplicar el operador "!" a valores de tipo' + argType, this.operator.row, this.operator.column);
                }
            }
            else if (this.operator.name === 'increment' || this.operator.name === 'decrement') {
                if (argType === 'int' || argType === 'double' || argType === 'char') {
                    return argType;
                }
                else {
                    return new SharpError('Semantico', 'Operacion invalida: no es posible aplicar el operador "' + this.operator.op +'" a valores de tipo' + argType, this.operator.row, this.operator.column);
                }
            }
            else {
                console.error(this.operator.name);
                console.error('ERROR DE PROGRA EN unary.js');
            }
        }
        else {
            // ERROR
            return argType;
        }
    }

    getTDC(env, label, temp) {
        let type = this.checkType(env);
        let code = [];

        // get 3DC from first arg
        let updater = this.arg.getTDC(env, label, temp);
        env = updater.env;
        label = updater.label;
        temp = updater.temp;
        let val = updater.value;
        type = updater.type;
        code.push(updater.code);

        let returnVal;
        switch(this.operator.name) {
            case 'minus':
                code.push(`t${temp} = - ${val};`);
                returnVal = `t${temp}`;
                temp++;
                break;
            case 'not':
                code.push(`t${temp} = ${val};`);
                code.push(`if (t${temp} == 1) goto L${label};`);
                code.push(`t${temp} = 1;`);
                code.push(`goto L${label+1};`);
                code.push(`L${label}:`);
                label++;
                code.push(`t${temp} = 0;`)
                code.push(`L${label}:`)
                label++;
                returnVal = `t${temp}`;
                temp++;
                break;
        }

        let up = new Updater(env, label, temp, code.join('\n'));
        up.addValue(returnVal);
        up.addType(type);
        return up;
    }
}

module.exports.Unary =  Unary;
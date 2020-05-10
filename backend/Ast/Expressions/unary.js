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
            case 'increment':
                let inc = this.incOrDec(env, label, temp, 1);
                label = inc.label;
                temp = inc.temp;
                code.push(inc.code);
                returnVal = inc.value;
                break;
            case 'decrement':
                let dec = this.incOrDec(env, label, temp, 0);
                label = dec.label;
                temp = dec.temp;
                code.push(dec.code);
                returnVal = dec.value;
                break;
        }

        let up = new Updater(env, label, temp, code.join('\n'));
        up.addValue(returnVal);
        up.addType(type);
        return up;
    }

    incOrDec(env, label, temp, opt) {
         // check that the variable that we are trying to asign exists
         let symbol = null;
         let counter = 0;
         let spaces = 0;
         let thenv= env.id;
         while (thenv != null) {
             let enviroment = Singleton.getEnviroment(thenv);
             let res = enviroment.getSymbol(this.arg.id);
             counter++;
             if (counter > 1) {
                 spaces += enviroment.last;
             }
             if (res.state) {
                 symbol = res.lead;
                 break;
             }
             else {
                 thenv = res.lead;
             }
         }
 
         if (symbol == null) {
             Singleton.insertError(new SharpError('Semantico', `La variable ${this.id.id} no existe en el contexto actual`, this.id.row, this.id.column))
         }

         // check it is not a constant
        if (symbol.constant) {
            Singleton.insertError(new SharpError('Semantico', `"${this.arg.id}" es una constante`, this.row, this.column));
            return new Updater(env, label, temp, null);
        }

        //
        let code = [];
        let pos = symbol.position;
        let role = symbol.role;
        let val = null;
        if (role === 'global var') {
            code.push(`t${temp} = heap[${pos}];`);
            if (opt === 1) {
                code.push(`t${temp} = t${temp} + 1;`)
                code.push(`heap[${pos}] = t${temp};`);
            }
            else {
                code.push(`t${temp} = t${temp} - 1;`)
                code.push(`heap[${pos}] = t${temp};`);
            }
            temp++;
            code.push(`t${temp} = heap[${pos}];`);
            val = `t${temp}`;
            temp++;
        }
        else if (role === 'local var') {
            code.push(`t${temp} = p - ${spaces};`);
            temp++;
            code.push(`t${temp} = t${temp-1} + ${pos};`);
            code.push(`t${temp + 1} = stack[t${temp}];`)
            if (opt === 1) {
                code.push(`t${temp + 1} = t${temp + 1} + 1;`);
                code.push(`stack[t${temp}] = t${temp + 1};`);
            }
            else {
                code.push(`t${temp + 1} = t${temp + 1} - 1;`);
                code.push(`stack[t${temp}] = t${temp + 1};`);
            }
            temp++;
            temp++;
            code.push(`t${temp} = stack[${temp-2}];`);
            val = `t${temp}`;
            temp++;
        }
        else {
            console.error('role');
            console.error('ERROR EN asignment.js');
        }
        if (code.length > 0) {
            let up = new Updater(env, label, temp, code.join('\n'));
            up.addValue(val);
            return up;
        }
        else 
            return new Updater(env, label, temp, null);
    }
}

module.exports.Unary =  Unary;
const Singleton = require('../../Procesor/Singleton/singleton').Singleton;
const SharpError = require('../../Procesor/Singleton/sharpError').SharpError;
const Updater = require('../Utilities/updater').Updater;

class Asignment {
    constructor(id, accessList, expression, row, column) {
        this.id = id; // Identifier
        this.accessList = accessList; // nodelist -> [ accesslist ]
        this.expression = expression; // expression
        this.row = row; // number
        this.column = column; // number
    }

    getDot() {
        return '[label="ASIGNMENT"];\n';
    }

    getChildren() {
        if (this.accessList.length > 0)
            return [this.id, this.accessList, this.expression];
        else 
            return [this.id, this.expression]
    }

    getTypeOf() {
        return 'asignment';
    }

    getTDC(env, label, temp) {
        let code = [];

        // check the variable type
        let varType = this.id.checkType(env);
        if (typeof(varType) === 'object') {
            // ERROR
            Singleton.insertError(varType);
            return new Updater(env, label, temp, null);
        }

        // check that the variable that we are trying to asign exists
        let symbol = null;
        let counter = 0;
        let spaces = 0;
        let thenv= env.id;
        while (thenv != null) {
            let enviroment = Singleton.getEnviroment(thenv);
            let res = enviroment.getSymbol(this.id.id);
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
            Singleton.insertError(new SharpError('Semantico', `"${this.id.id}" es una constante`, this.row, this.column));
            return new Updater(env, label, temp, null);
        }

        // get the expression type
        let expType = this.expression.checkType(env);
        if (typeof(expType) === 'object') {
            Singleton.insertError(expType);
            return new Updater(env, label, temp, null);
        }

        // check that types match
        if (varType != expType) {
            let flag = false;
            if (this.type.name != 'double') {
                if (expType === 'int' || expType === 'char') {
                    flag = true;
                }
            }
            else if (this.type.name === 'int') {
                if (expType === 'char') {
                    flag = true;
                }
            }

            if (!flag) {
                Singleton.insertError(new SharpError('Semantico', `"${this.id.id}" es una variable de tipo ${varType}, mientras que la expresion es de tipo ${expType}`, this.row, this.column));
                return new Updater(env, label, temp, null);
            }
        }

        // get the value from the expression
        let updater = this.expression.getTDC(env, label, temp);
        label = updater.label;
        temp = updater.temp;
        if (updater.code != null)
            code.push(updater.code);

        // TODO - asign the value to the variable
        let pos = symbol.position;
        let role = symbol.role;
        if (role === 'global var') {
            code.push(`heap[${pos}] = ${updater.value};`);
        }
        else if (role === 'local var') {
            code.push(`t${temp} = p - ${spaces};`);
            temp++;
            code.push(`t${temp} = t${temp-1} + ${pos};`);
            code.push(`stack[t${temp}] = ${updater.value};`);
            temp++;
        }
        else {
            console.error('role');
            console.error('ERROR EN asignment.js');
        }
        if (code.length > 0) 
            return new Updater(env, label, temp, code.join('\n'));
        else 
            return new Updater(env, label, temp, null);
    }
}

module.exports.Asignment = Asignment;
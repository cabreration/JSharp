const Singleton = require('../../Procesor/Singleton/singleton').Singleton;
const SharpError = require('../../Procesor/Singleton/sharpError').SharpError;
const Updater = require('../Utilities/updater').Updater;

class Cast {
    constructor(type, expression) {
        this.type = type; // Type;
        this.expression = expression; // Expression
        this.byValue = false;
    }

    byValue() {
        this.byValue = true;
    }

    getChildren() {
        return [ this.type, this.expression ];
    }

    getDot() {
        return '[label="CAST"];\n';
    }

    getTypeOf() {
        return 'cast';
    }

    checkType(env) {
        let type = this.expression.checkType(env);
        if (typeof(type) === 'object') {
            return type;
        }

        if (type != 'int' && type != 'double' && type != 'char') {
            return new SharpError('Semantico', `El tipo ${type} no puede ser casteado a ${this.type.name}`, this.type.row, this.type.column);
        }

        return this.type.name;
    }

    getTDC(env, label, temp) {
        //return new Updater(env, label, temp, null);

        // get the expression value
        let code = [];

        let expVal = this.expression.getTDC(env, label, temp);
        if (expVal.value == null) {
            return new Updater(env, label, temp, null);
        }
        if (expVal.code != null) {
            code.push(expVal.code);
        }
        label = expVal.label;
        temp = expVal.temp;
        let val = expVal.value;
        let type = expVal.type;

        // if it is a double i need to erase the floating parte
        let temp1 = `t${temp}`;
        temp++;
        let temp2 = `t${temp}`;
        temp++;
        if (type === 'double') {
            code.push(`${temp1} = ${val};`);
            code.push(`${temp2} = ${temp1} % 1;`);
            code.push(`${temp1} = ${temp1} - ${temp2};`);
            let up = new Updater(env, label, temp, code.join('\n'));
            up.addValue(temp1);
            up.addType(this.type.name);
            return up;
        } 
        else {
            let up = new Updater(env, label, temp, code.join('\n'));
            up.addValue(val);
            up.addType(this.type.name);
            return up;
        }
    }
}

module.exports.Cast = Cast;
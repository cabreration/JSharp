const SharpError = require('../../Procesor/Singleton/sharpError').SharpError;
const Singleton = require('../../Procesor/Singleton/singleton').Singleton;

class Binary {
    constructor(operator, arg1, arg2) {
        this.operator = operator; // Operator
        this.arg1 = arg1; // Expression
        this.arg2 = arg2; // Expression
    }

    getDot() {
        return '[label="BINARY EXPRESSION -> ' + this.operator.op + '"];\n';
    }

    getChildren() {
        return [ this.arg1, this.arg2 ];
    }

    getTypeOf() {
        return 'binary';
    }

    checkType(envId) {
        let type1 = this.arg1.checkType(envId);
        let type2 = this.arg2.checkType(envId);
        if (typeof(type1) === 'object') {
            return type1;
        }
        else if (typeof(type2) === 'object') {
            return type2;
        }
        else {
            // both types are valid
            if (this.operator.name === 'xor' || this.operator.name === 'or' || this.operator.name === 'and') {
                return this.validateBoolean(type1, type2);
            }
            else if (this.operator.name === 'not equals' || this.operator.name === 'equal value') {
                return this.validateEqualsOrNot(type1, type2);
            }
            else if (this.operator.name === 'equal reference') {
                return this.validateEqualReference(type1, type2);
            }
            else if (this.operator.name === 'less than' || this.operator.name === 'less or equal to'
            || this.operator.name === 'greater than' || this.operator.name === 'greater or equal to') {
                return this.validateRelational(type1, type2);
            }
            else if (this.operator.name === 'plus') {
                this.validateConcatenation(type1, type2);
            }
            else if (this.operator.name === 'minus' || this.operator.name === 'times' || this.operator.name === 'div') {
                return this.validateArithmetic(type1, type2);
            }
            else if (this.operator.name === 'mod' || this.operator === 'power') {
                if (type1 === 'int' && type2 === 'int') {
                    return 'int'
                }
                else {
                    return new SharpError('Semantico', `Operacion Invalida: no es posible aplicar el operador ${this.operator.op} entre valores de tipo ${type1} y ${type2}`, this.operator.row, this.operator.column);
                }
            }
            else {
                console.error(this.operator.name);
                console.error('ERROR DE PROGRA EN binary.js');
            }
        }
    }

    validateBoolean(type1, type2) {
        if (type1 != 'boolean') {
            return new SharpError('Semantico', 'Operacion invalida: No es posible aplicar el operador ' + this.operator.op +' a valores de tipo' + type1, this.operator.row, this.operator.column);
        }
        else if (type2 != 'boolean') {
            return new SharpError('Semantico', 'Operacion invalida: No es posible aplicar el operador ' + this.operator.op + ' a valores de tipo' + type2, this.operator.row, this.operator.column);
        }
        else 
            return 'boolean';
    }

    validateRelational(type1, type2) {
        if (type1 === 'int' || type1 === 'double' || type1 === 'char') {
            if (type2 === 'int' || type2 === 'double' || type2 === 'char') {
                return 'boolean';
            }
            else {
                return new SharpError('Semantico', 'Operacion invalida: No es posible aplicar el operando ' + this.operator.op + ' a valores de tipo ' + type2, this.operator.row, this.operator.column);
            }
        }
        else {
            return new SharpError('Semantico', 'Operacion invalida: No es posible aplicar el operador ' + this.operator.op +' a valores de tipo ' + type1, this.operator.row, this.operator.column);
        }
    }

    validateEqualsOrNot(type1, type2) {
        if (type1 === 'int' || type1 === 'double' || type1 === 'char') {
            if (type2 === 'int' || type2 === 'double' || type2 === 'char') {
                return 'boolean';
            }
            else {
                return new SharpError('Semantico', 'Operacion invalida: No es posible aplicar el operando ' + this.operator.op + ' entre valores de tipo ' + type1 + ' y ' + type2, this.operator.row, this.operator.column);
            }
        }
        else if (type1 === 'string') {
            if (type2 === 'string') {
                return 'boolean';
            }
            else {
                return new SharpError('Semantico', 'Operacion invalida: No es posible aplicar el operador ' + this.operator.op +' entre valores de tipo ' + type1 + ' y ' + type2, this.operator.row, this.operator.column);
            }
        }
        else if (type1 === 'boolean') {
            if (type2 === 'boolean') {
                'boolean'
            }
            else {
                return new SharpError('Semantico', 'Operacion invalida: No es posible aplicar el operador ' + this.operator.op +' entre valores de tipo ' + type1 + ' y ' + type2, this.operator.row, this.operator.column);
            }
        }
        else {
            return new SharpError('Semantico', 'Operacion invalida: No es posible aplicar el operador ' + this.operator.op +' entre valores de tipo ' + type1 + ' y ' + type2, this.operator.row, this.operator.column);
        }
    }

    validateEqualReference(type1, type2) {
        if (type1 === 'string' && type2 === 'string') {
            return 'boolean';
        } 
        else if (type1 === 'array' || type2 === 'array') {
            return 'boolean';
        }
        else if (type1 === 'strc' && type2 === 'strc') {
            return 'boolean';
        }
        else {
            return new SharpError('Semantico', 'Operacion invalida: No es posible aplicar el operador === entre valores de tipo ' + type1 + ' y ' + type2, this.operator.row, this.operator.column);
        }
    }

    validateArithmetic(type1, type2) {
        if (type1 === 'int') {
            if (type2 === 'int') {
                return this.operator.name === 'div' ? 'double' : 'int';
            }
            else if (type2 === 'double') {
                return 'double';
            }
            else if (type2 === 'char') {
                return this.operator.name === 'div' ? 'double' : 'int';
            }
            else {
                return new SharpError('Semantico', `Operacion invalida: no es posible aplicar el operador ${this.operator.op} entre valores de tipo ${type1} y ${type2}`, this.operator.row, this.operator.column);
            }
        }
        else if (type1 === 'double') {
            if (type2 === 'int' || type2 === 'double' || type2 === 'char') {
                return 'double';
            }
            else {
                return new SharpError('Semantico', `Operacion invalida: no es posible aplicar el operador ${this.operator.op} entre valores de tipo ${type1} y ${type2}`, this.operator.row, this.operator.column);
            }
        }
        else if (type1 === 'char') {
            if (type2 === 'int' || type2 === 'char') {
                return this.operator.name === 'div' ? 'double' : 'int';
            }
            else if (type2 === 'double') {
                return 'double';
            }
            else {
                return new SharpError('Semantico', `Operacion invalida: no es posible aplicar el operador ${this.operator.op} entre valores de tipo ${type1} y ${type2}`, this.operator.row, this.operator.column);
            }
        }
        else {
            return new SharpError('Semantico', `Operacion invalida: no es posible aplicar el operador ${this.operator.op} entre valores de tipo ${type1} y ${type2}`, this.operator.row, this.operator.column);
        }
    }

    validateConcatenation(type1, type2) {
        if (type1 === 'int') {
            if (type2 === 'int' || type2 === 'char') {
                return 'int';
            }
            else if (type2 === 'double') {
                return 'double';
            }
            else if (type2 === 'string') {
                return 'string';
            }
            else {
                return new SharpError('Semantico', `Operacion invalida: no es posible aplicar el operador "+" entre valores de tipo ${type1} y ${type2}`, this.operator.row, this.operator.column);
            }
        }
        else if (type1 === 'double') {
            if (type2 === 'int' || type2 === 'char' || type2 === 'double') {
                return 'double'
            }
            else if (type2 === 'string') {
                return 'string';
            }
            else {
                return new SharpError('Semantico', `Operacion invalida: no es posible aplicar el operador "+" entre valores de tipo ${type1} y ${type2}`, this.operator.row, this.operator.column);
            }
        }
        else if (type1 === 'char') {
            if (type2 === 'int') {
                return 'int';
            }
            else if (type2 === 'double') {
                return 'double';
            }
            else if (type2 === 'string' || type2 === 'char') {
                return 'string';
            }
            else {
                return new SharpError('Semantico', `Operacion invalida: no es posible aplicar el operador "+" entre valores de tipo ${type1} y ${type2}`, this.operator.row, this.operator.column);
            }
        }
        else if (type1 === 'string') {
            if (type2 === 'int' || type2 === 'double' || type2 === 'string' || type2 === 'char' || type2 === 'boolean') {
                return 'string';
            }
            else {
                return new SharpError('Semantico', `Operacion invalida: no es posible aplicar el operador "+" entre valores de tipo ${type1} y ${type2}`, this.operator.row, this.operator.column);
            }
        }
        else if (type1 === 'boolean') {
            if (type2 === 'string') {
                return 'string';
            }
            else {
                return new SharpError('Semantico', `Operacion invalida: no es posible aplicar el operador "+" entre valores de tipo ${type1} y ${type2}`, this.operator.row, this.operator.column);
            }
        }
        else {
            return new SharpError('Semantico', `Operacion invalida: no es posible aplicar el operador "+" entre valores de tipo ${type1} y ${type2}`, this.operator.row, this.operator.column);
        }
    }

    getTDC(env, label, temp, h, p) {
        let code = [];

        // get 3DC from first arg
        let updater1 = this.arg1.getTDC(env, label, temp, h, p);
        env = updater1.env;
        label = updater1.label;
        temp = updater1.temp;
        h = updater1.h;
        p = updater1.p;
        let val1 = updater1.value;
        let type1 = updater1.type;
        code.push(updater1.code);

        // get 3DC from second arg
        let updater2 = this.arg2.getTDC(env, label, temp, h, p);
        env = updater2.env;
        label = updater2.label;
        temp = updater2.temp;
        h = updater2.h;
        p = updater2.p;
        let val2 = updater2.value;
        let type2 = updater2.type;
        code.push(updater2.code);

        // TODO - perform the operation
        let val = `t${temp}`;
        switch(this.operator.name) {
            case 'xor':
                // TODO
                break;
            case 'or':
                // TODO
                break;
            case 'and':
                // TODO
                break;
            case 'not equals':
                code.push(`t${temp} = ${val1} <> ${val2};`);
                val = `t${temp}`;
                temp++;
                break;
            case 'equal value':
                code.push(`t${temp} = ${val1} == ${val2};`);
                val = `t${temp}`;
                temp++;
                break;
            case 'equal reference':
                // TODO
                break;
            case 'less than':
                code.push(`t${temp} = ${val1} < ${val2};`);
                val = `t${temp}`;
                temp++;
                break;
            case 'less or equal to':
                code.push(`t${temp} = ${val1} <= ${val2};`);
                val = `t${temp}`;
                temp++;
                break;
            case 'greater than':
                code.push(`t${temp} = ${val1} > ${val2};`);
                val = `t${temp}`;
                temp++;
                break;
            case 'greater or equal to':
                code.push(`t${temp} = ${val1} >= ${val2};`);
                val = `t${temp}`;
                temp++;
                break;
            case 'plus':
                let plus = this.translateAdition(type1, type2, val1, val2, temp);
                code.push(plus.code);
                temp = plus.temp;
                temp++;
                val = plus.val;
                h = plus.h;
                break;
            case 'minus':
                code.push(`t${temp} =${val1} - ${val2};`);
                val = `t${temp}`;
                temp++;
                break;
            case 'times':
                code.push(`t${temp} = ${val1} * ${val2};`);
                val = `t${temp}`;
                temp++;
                break;
            case 'div':
                code.push(`t${temp} = ${val1} / ${val2};`);
                val = `t${temp}`;
                temp++;
                break;
            case 'mod':
                code.push(`t${temp} = ${val1} % ${val2};`);
                val = `t${temp}`;
                temp++;
                break;
            case 'power':
                code.push(`t${temp} = ${val1};`);
                temp++;
                code.push(`L${label}:`);
                label++;
                code.push(`if (${val2} > 1) goto L${label};`)
                label++;
                code.push(`goto L${label};`);
                label++;
                code.push(`L${label-1}:`);
                code.push(`t${temp} = t${temp} * ${val1};`);
                code.push(`${val2} = ${val2} - 1;`);
                code.push(`goto L${label - 2};`);
                code.push(`L${label}:`);
                val = `t${temp}`;
                temp++;
                break;
            default:
                console.error(this.operator.name);
                console.error('ERROR EN binary.js');
                return null;
        }
    }

    translateAdition(type1, type2, val1, val2, temp, h) {
        if (type1 === 'string' && type2 != 'string') {
            if (type2 === 'double' || type2 === 'int') {

            }
            else if (type2 === 'boolean') {

            }
            else if (type2 === 'char') {

            }
        }
        else if (type1 != 'string' && type2 === 'string') {
            if (type1 === 'char' || type1 === 'double' || type2 === 'int') {

            }
            else if (type1 === 'boolean') {

            }
            else if (type1 === 'char') {

            }
        }
        else if (type1 === 'string' && type2 === 'string') {

        }
        else if (type1 === 'char' && type2 === 'char') {
            let code = [];
            let val = `t${temp}`;
            temp++;
            code.push(`${val} = h;`);
            code.push(`heap[${h}] = ${val1};`);
            Singleton.heap[h] = val1;
            h++;
            code.push('h = h + 1;');
            code.push(`heap[${h}] = ${val2};`);
            Singleton.heap[h] =  val2;
            h++;
            code.push('h = h + 1;');
            code.push(`heap[${h}] = 0;`);
            Singleton.heap[h] = 0;
            h++;
            code.push('h = h + 1;');
            
        }
        else if (type1 != 'string' && type2 != 'string') {
            return {
                code: `t${temp} = ${val1} + ${val2};`,
                temp: temp + 1,
                val: `t${temp}`, 
                h: h
            }
        }
        else {
            console.error('ERROR EN binary.js');
            console.error(`${type1}, ${type2}`);
        }
    }
}

module.exports.Binary =  Binary;
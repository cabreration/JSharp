const SharpError = require('../../Procesor/Singleton/sharpError').SharpError;
const Singleton = require('../../Procesor/Singleton/singleton').Singleton;
const Updater = require('../Utilities/updater').Updater;

class Binary {
    constructor(operator, arg1, arg2) {
        this.operator = operator; // Operator
        this.arg1 = arg1; // Expression
        this.arg2 = arg2; // Expression
        this.byValue = false;
    }

    byValue() {
        this.byValue = true;
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
                return this.validateConcatenation(type1, type2);
            }
            else if (this.operator.name === 'minus' || this.operator.name === 'times' || this.operator.name === 'div') {
                return this.validateArithmetic(type1, type2);
            }
            else if (this.operator.name === 'mod' || this.operator.name === 'power') {
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
            return new SharpError('Semantico', 'Operacion invalida: No es posible aplicar el operador ' + this.operator.op +' a valores de tipo ' + type1, this.operator.row, this.operator.column);
        }
        else if (type2 != 'boolean') {
            return new SharpError('Semantico', 'Operacion invalida: No es posible aplicar el operador ' + this.operator.op + ' a valores de tipo ' + type2, this.operator.row, this.operator.column);
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
        if (type1 === 'null') {
            if (type2 === 'string' || type2.includes('[]')) {
                return 'boolean';
            }
            else {
                switch(type2) {
                    case 'int':
                    case 'double':
                    case 'boolean':
                    case 'char':
                        return new SharpError('Semantico', 'Operacion invalida: No es posible aplicar el operando ' + this.operator.op + ' entre valores de tipo ' + type1 + ' y ' + type2, this.operator.row, this.operator.column);
                    default:
                        return 'boolean'
                }
            }
        }
        else if (type2 === 'null') {
            if (type1 === 'string' || type1.includes('[]')) {
                return 'boolean';
            }
            else {
                switch(type2) {
                    case 'int':
                    case 'double':
                    case 'boolean':
                    case 'char':
                        return new SharpError('Semantico', 'Operacion invalida: No es posible aplicar el operando ' + this.operator.op + ' entre valores de tipo ' + type1 + ' y ' + type2, this.operator.row, this.operator.column);
                    default:
                        return 'boolean'
                }
            }
        }
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
                return 'boolean';
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
        switch(type1) {
            case "int":
            case "double":
            case "boolean":
            case "char":
                return new SharpError('Semantico', 'Operacion invalida: No es posible aplicar el operador === entre valores de tipo ' + type1 + ' y ' + type2, this.operator.row, this.operator.column);
        }
        switch(type2) {
            case "int":
            case "double":
            case "boolean":
            case "char":
                return new SharpError('Semantico', 'Operacion invalida: No es posible aplicar el operador === entre valores de tipo ' + type1 + ' y ' + type2, this.operator.row, this.operator.column);
        }

        if (type1 === 'null' || type2 === 'null') {
            return 'boolean';
        }

        if (type1 != type2) {
            return new SharpError('Semantico', 'Operacion invalida: No es posible aplicar el operador === entre valores de tipo ' + type1 + ' y ' + type2, this.operator.row, this.operator.column);
        }
        return 'boolean';
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

    getTDC(env, label, temp) {
        let type = this.checkType(env);
        let code = [];
        if (typeof(type) === 'object') {
            Singleton.insertError(type);
            return new Updater(env, label, temp, null);
        }

        // get 3DC from first arg
        let updater1 = this.arg1.getTDC(env, label, temp);
        env = updater1.env;
        label = updater1.label;
        temp = updater1.temp;
        let val1 = updater1.value;
        let type1 = updater1.type;
        code.push(updater1.code);

        // get 3DC from second arg
        let updater2 = this.arg2.getTDC(env, label, temp);
        env = updater2.env;
        label = updater2.label;
        temp = updater2.temp;
        let val2 = updater2.value;
        let type2 = updater2.type;
        code.push(updater2.code);

        // TODO - perform the operation
        let val; // = `t${temp}`;
        switch(this.operator.name) {
            case 'xor':
                // TOTEST
                let xor = this.generateXor3DC(val1, val2, label, temp);
                code.push(xor.code);
                temp = xor.temp;
                label = xor.label;
                val = xor.val;
                break;
            case 'or':
                // TOTEST
                let or = this.generateOr3DC(val1, val2, label, temp);
                code.push(or.code);
                temp = or.temp;
                label = or.label;
                val = or.val;
                break;
            case 'and':
                // TOTEST
                let and = this.generateAnd3DC(val1, val2, label, temp);
                code.push(and.code);
                temp = and.temp;
                label = and.label;
                val = and.val;
                break;
            case 'not equals':
                if (type1 != 'string') {
                    code.push(`if (${val1} <> ${val2}) goto L${label};`);
                    code.push(`t${temp} = 0;`);
                    code.push(`goto L${label+1};`);
                    code.push(`L${label}:`)
                    label++;
                    code.push(`t${temp} = 1;`);
                    code.push(`L${label}:`);
                    label++;
                    val = `t${temp}`;
                    temp++;
                }
                else {
                    let ne = this.generateNEString3DC(val1, val2, label, temp);
                    code.push(ne.code);
                    temp = ne.temp;
                    label = ne.label;
                    val = ne.val;
                }
                break;
            case 'equal value':
                if (type1 != 'string') {
                    code.push(`if (${val1} == ${val2}) goto L${label};`);
                    code.push(`t${temp} = 0;`);
                    code.push(`goto L${label+1};`);
                    code.push(`L${label}:`)
                    label++;
                    code.push(`t${temp} = 1;`);
                    code.push(`L${label}:`);
                    label++;
                    val = `t${temp}`;
                    temp++;
                }
                else {
                    let eq = this.generateEString3DC(val1, val2, label, temp);
                    code.push(eq.code);
                    temp = eq.temp;
                    label = eq.label;
                    val = eq.val
                }
                break;
            case 'equal reference':
                code.push(`if (${val1} == ${val2}) goto L${label};`);
                code.push(`t${temp} = 0;`);
                code.push(`goto L${label+1};`);
                code.push(`L${label}:`)
                label++;
                code.push(`t${temp} = 1;`);
                code.push(`L${label}:`);
                label++;
                val = `t${temp}`;
                temp++;
                break;
            case 'less than':
                code.push(`if (${val1} < ${val2}) goto L${label};`);
                code.push(`t${temp} = 0;`);
                code.push(`goto L${label+1};`);
                code.push(`L${label}:`)
                label++;
                code.push(`t${temp} = 1;`);
                code.push(`L${label}:`);
                label++;
                val = `t${temp}`;
                temp++;
                break;
            case 'less or equal to':
                code.push(`if (${val1} <= ${val2}) goto L${label};`);
                code.push(`t${temp} = 0;`);
                code.push(`goto L${label+1};`);
                code.push(`L${label}:`)
                label++;
                code.push(`t${temp} = 1;`);
                code.push(`L${label}:`);
                label++;
                val = `t${temp}`;
                temp++;
                break;
            case 'greater than':
                code.push(`if (${val1} > ${val2}) goto L${label};`);
                code.push(`t${temp} = 0;`);
                code.push(`goto L${label+1};`);
                code.push(`L${label}:`)
                label++;
                code.push(`t${temp} = 1;`);
                code.push(`L${label}:`);
                label++;
                val = `t${temp}`;
                temp++;
                break;
            case 'greater or equal to':
                code.push(`if (${val1} >= ${val2}) goto L${label};`);
                code.push(`t${temp} = 0;`);
                code.push(`goto L${label+1};`);
                code.push(`L${label}:`)
                label++;
                code.push(`t${temp} = 1;`);
                code.push(`L${label}:`);
                label++;
                val = `t${temp}`;
                temp++;
                break;
            case 'plus':
                let plus = this.translateAdition(type1, type2, val1, val2, temp, label);
                code.push(plus.code);
                temp = plus.temp;
                val = plus.val;
                label = plus.label;
                break;
            case 'minus':
                code.push(`t${temp} = ${val1} - ${val2};`);
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
                code.push(`t${temp} = ${val1};`);
                temp++
                code.push(`t${temp} = ${val2};`);
                code.push(`L${label}:`);
                label++;
                code.push(`if (t${temp} > 1) goto L${label};`)
                label++;
                code.push(`goto L${label};`);
                label++;
                code.push(`L${label-2}:`);
                code.push(`t${temp-1} = t${temp-1} * t${temp - 2};`);
                code.push(`t${temp} = t${temp} - 1;`);
                code.push(`goto L${label - 3};`);
                code.push(`L${label-1}:`);
                val = `t${temp-1}`;
                temp++;
                break;
            default:
                console.error(this.operator.name);
                console.error('ERROR EN binary.js');
                return null;
        }

        let up = new Updater(env, label, temp, code.join('\n'));
        up.addValue(val);
        up.addType(type);
        return up;
    }

    translateAdition(type1, type2, val1, val2, temp, label) {
        let code = [];
        let val = `t${temp}`;
        if (type1 === 'string' && type2 != 'string') {
            temp++;
            code.push(`${val} = h;`);
            let str = this.generateString3DC(val1, label, temp);
            code.push(str.code);
            temp = str.temp;
            label = str.label;
            if ( type2 === 'int') {
                let n = this.generateNumber3DC(val2, label, temp);
                temp = n.temp;
                label = n.label;
                code.push(n.code);
            }
            else if (type2 === 'double') {
                let d = this.generateDouble3DC(val2, label, temp);
                temp = d.temp;
                label = d.label;
                code.push(d.code);
            }
            else if (type2 === 'boolean') {
                let t = this.generateBool3DC(val2, label);
                label = t.label;
                code.push(t.code);
            }
            else if (type2 === 'char') {
                code.push(`heap[h] = ${val2};`);
                code.push(`h = h + 1;`);
            }
            code.push(`heap[h] = 0;`);
            code.push(`h = h + 1;`);
            return {
                code: code.join('\n'),
                temp: temp,
                val: val, 
                label: label,
            }
        }
        else if (type1 != 'string' && type2 === 'string') {
            temp++;
            code.push(`${val} = h;`);
            if (type1 === 'int') {
                let n = this.generateNumber3DC(val1, label, temp);
                temp = n.temp;
                label = n.label;
                code.push(n.code);
            }
            else if (type1 === 'double') {
                let d = this.generateDouble3DC(val1, label, temp);
                temp = d.temp;
                label = d.label;
                code.push(d.code);
            }
            else if (type1 === 'boolean') {
                let t = this.generateBool3DC(val1, label);
                label = t.label;
                code.push(t.code);
            }
            else if (type1 === 'char') {
                code.push(`heap[h] = ${val1};`);
                code.push(`h = h + 1;`);
            }
            let str = this.generateString3DC(val2, label, temp);
            code.push(str.code);
            temp = str.temp;
            label = str.label;
            code.push(`heap[h] = 0;`);
            code.push(`h = h + 1;`);
            return {
                code: code.join('\n'),
                temp: temp,
                val: val, 
                label: label
            }
        }
        else if (type1 === 'string' && type2 === 'string') {
            temp++;
            code.push(`${val} = h;`);
            let str = this.generateString3DC(val1, label, temp);
            code.push(str.code);
            temp = str.temp;
            label = str.label;
            str = this.generateString3DC(val2, label, temp);
            code.push(str.code);
            temp = str.temp;
            label = str.label;
            code.push(`heap[h] = 0;`);
            code.push(`h = h + 1;`);
            return {
                code: code.join('\n'),
                temp: temp,
                val: val,
                label: label
            }
        }
        else if (type1 === 'char' && type2 === 'char') {
            let code = [];
            let val = `t${temp}`;
            temp++;
            code.push(`${val} = h;`);
            code.push(`heap[h] = ${val1};`);
            code.push('h = h + 1;');
            code.push(`heap[h] = ${val2};`);
            code.push('h = h + 1;');
            code.push(`heap[h] = 0;`);
            code.push('h = h + 1;');
            return {
                code: code.join('\n'),
                temp: temp,
                val: val,
                label: label
            }
        }
        else if (type1 != 'string' && type2 != 'string') {
            return {
                code: `t${temp} = ${val1} + ${val2};`,
                temp: temp + 1,
                val: `t${temp}`,
                label: label
            }
        }
        else {
            console.error('ERROR EN binary.js');
            console.error(`${type1}, ${type2}`);
        }
    }

    generateBool3DC(val, label) {
        let code = [];
        code.push(`if (${val} == 0) goto L${label};`)
        code.push(`heap[h] = 116;`);
        code.push('h = h + 1;');
        code.push(`heap[h] = 114;`);
        code.push('h = h + 1;');
        code.push('heap[h] = 117;');
        code.push('h = h + 1;');
        code.push('heap[h] = 101;');
        code.push('h = h + 1;');
        code.push(`goto L${label + 1};`)
        code.push(`L${label}:`);
        code.push(`heap[h] = 102;`);
        code.push('h = h + 1;');
        code.push(`heap[h] = 97;`);
        code.push('h = h + 1;');
        code.push('heap[h] = 108;');
        code.push('h = h + 1;');
        code.push('heap[h] = 115;');
        code.push('h = h + 1;');
        code.push('heap[h] = 101;');
        code.push('h = h + 1;');
        code.push(`L${label+1}:`);
        label++;
        label++;
        return {
            code: code.join('\n'),
            label: label
        }
    }

    generateString3DC(val, label, temp) {
        let code = [];
        code.push(`t${temp} = heap[${val}];`); // first char
        code.push(`L${label}:`);
        code.push(`if (t${temp} == 0) goto L${label + 1};`)
        //code.push(`if (t${temp} == 0) goto L${label + 2};`);
        code.push(`heap[h] = t${temp};`);
        code.push('h = h + 1;');
        code.push(`${val} = ${val} + 1;`);
        code.push(`t${temp} = heap[${val}];`);
        code.push(`goto L${label};`);
        label++;
        code.push(`L${label}:`);
        //label++;
        // Print null here
        /*code.push(`heap[h] = 110;`);
        code.push('h = h + 1;')
        code.push('heap[h] = 117;');
        code.push('h = h + 1;')
        code.push('heap[h] = 108;');
        code.push('h = h + 1;')
        code.push('heap[h] = 108;');
        code.push('h = h + 1;');
        code.push(`L${label}:`);*/
        label++;
        temp++;
        return {
            temp: temp,
            label: label,
            code: code.join('\n')
        }
    }

    generateDouble3DC(val, label, temp) {
        let code = [];
        let temp1 = temp++;
        let temp2 = temp++;
        let temp3 = temp++;
        let temp4 = temp++;
        let label1 = label++;
        let label2 = label++;

        code.push(`t${temp1} = ${val}; # original`);
        code.push(`t${temp2} = t${temp1} % 1; #parte decimal`);
        code.push(`t${temp3} = t${temp1} - t${temp2}; # parte entera`);
        code.push(`t${temp4} = 0;`);
        code.push(`L${label1}:`);
        code.push(`if (t${temp4} == 4) goto L${label2};`);
        code.push(`t${temp2} = t${temp2} * 10;`);
        code.push(`t${temp4} = t${temp4} + 1;`);
        code.push(`goto L${label1};`);
        code.push(`L${label2}: # agregamos la parte entera`);
        let up = this.generateNumber3DC(`t${temp3}`, label, temp);
        temp = up.temp;
        label = up.label;
        code.push(up.code);
        code.push(`heap[h] = 46;`);
        code.push('h = h + 1;');
        up = this.generateNumber3DC(`t${temp2}`, label, temp);
        temp = up.temp;
        label = up.label;
        code.push(up.code);
        return {
            temp: temp,
            label: label,
            code: code.join('\n')
        }
    }

    generateNumber3DC(val, label, temp) {
        let code = [];
        let temp1 = temp;
        let temp2 = temp + 1; // contains the accumulated number
        let temp3 = temp + 2;
        let temp4 = temp + 3;
        let temp5 = temp + 4;
        let temp6 = temp + 5;
        temp += 6;
        let label1 = label;
        let label2 = label + 1;
        let label3 = label + 2;
        let label4 = label + 3;
        let label5 = label + 4;
        let label6 = label + 5;
        let label7 = label + 6;
        let label8 = label + 7;
        let label9 = label + 8;
        label += 9;
        code.push(`t${temp1} = ${val};`);
        code.push(`t${temp5} = 0;`);
        code.push(`if (t${temp1} > 0) goto L${label7};`)
        code.push(`t${temp6} = 1;`);
        code.push(`t${temp1} = -1 * t${temp1};`)
        code.push(`goto L${label8};`)
        code.push(`L${label7}:`)
        code.push(`t${temp6} = 0;`);
        code.push(`L${label8}:`);
        /* Printing numbers that end in 0 */

        code.push(`if (t${temp1} <> 0) goto L${label5};`);
        code.push(`heap[h] = 48;`)
        code.push('h = h + 1;')
        code.push(`goto L${label6};`);
        code.push(`L${label5}:`);
        code.push(`t${temp4} = t${temp1} % 10;`);
        code.push(`if (t${temp4} > 0) goto L${label4};`)
        code.push(`t${temp1} = t${temp1} / 10;`);
        code.push(`t${temp5} = t${temp5} + 1;`)
        code.push(`goto L${label5};`);

        /* Printing numbers that end in 0 */
        code.push(`L${label4}:`)
        code.push(`t${temp2} = 0;`);
        code.push(`L${label1}:`);
        code.push(`if (t${temp1} == 0) goto L${label2};`);
        code.push(`t${temp3} = t${temp1} % 10;`);
        code.push(`t${temp1} = t${temp1} - t${temp3};`)
        code.push(`t${temp1} = t${temp1} / 10;`);
        code.push(`t${temp2} = t${temp2} * 10;`)
        code.push(`t${temp2} = t${temp2} + t${temp3};`);
        code.push(`goto L${label1};`);
        code.push(`L${label2}:`);
        code.push(`if (t${temp6} == 0) goto L${label9};`)
        code.push(`heap[h] = 45;`)
        code.push('h = h + 1;');
        code.push(`L${label9}:`)
        code.push(`if (t${temp2} == 0) goto L${label3};`);
        code.push(`t${temp3} = t${temp2} % 10;`);
        code.push(`t${temp2} = t${temp2} - t${temp3};`);
        code.push(`t${temp2} = t${temp2} / 10;`);
        code.push(`t${temp3} = t${temp3} + 48;`);
        code.push(`heap[h] = t${temp3};`);
        code.push('h = h + 1;');
        code.push(`goto L${label9};`);
        code.push(`L${label3}:`);
        // aqui hay que imprimir los ceros que le quitamos al principio
        code.push(`if (t${temp5} == 0) goto L${label6};`);
        code.push(`heap[h] = 48;`);
        code.push(`h = h + 1;`);
        code.push(`t${temp5} = t${temp5} - 1;`)
        code.push(`goto L${label3};`)
        code.push(`L${label6}:`);
        return {
            temp: temp,
            label: label,
            code: code.join('\n')
        }
    }

    generateAnd3DC(val1, val2, label, temp) {
        let code = [];
        let temp1 = `t${temp}`;
        temp++;
        let temp2 = `t${temp}`;
        temp++;
        let temp3 = `t${temp}`;
        temp++;
        let label1 = `L${label}`;
        label++;
        let label2 = `L${label}`;
        label++;
        let label3 = `L${label}`;
        label++;
        let label4 = `L${label}`;
        label++;

        code.push(`${temp1} = ${val1};`);
        code.push(`${temp2} = ${val2};`);
        code.push(`if (${temp1} == 1) goto ${label1};`);
        code.push(`goto ${label2};# false`); 
        code.push(`${label1}:`);
        code.push(`if (${temp2} == 1) goto ${label3};`);
        code.push(`${label2}:`);
        code.push(`${temp3} = 0;`);
        code.push(`goto ${label4};`);
        code.push(`${label3}:`);
        code.push(`${temp3} = 1;`);
        code.push(`${label4}:`); 

        return {
            code: code.join('\n'),
            label: label,
            temp: temp,
            val: temp3
        }
    }

    generateOr3DC(val1, val2, label, temp) {
        let code = [];
        let temp1 = `t${temp}`;
        temp++;
        let temp2 = `t${temp}`;
        temp++;
        let temp3 = `t${temp}`;
        temp++;
        let label1 = `L${label}`;
        label++;
        let label2 = `L${label}`;
        label++;

        code.push(`${temp1} = ${val1};`);
        code.push(`${temp2} = ${val2};`);
        code.push(`if (${temp1} == 1) goto ${label1};`);
        code.push(`if (${temp2} == 1) goto ${label1};`);
        code.push(`${temp3} = 0;`);
        code.push(`goto ${label2};`); 
        code.push(`${label1}:`);
        code.push(`${temp3} = 1;`);
        code.push(`${label2}:`);

        return {
            code: code.join('\n'),
            label: label,
            temp: temp,
            val: temp3
        }
    }

    generateXor3DC(val1, val2, label, temp) {
        let code = [];
        let temp1 = `t${temp}`;
        temp++;
        let temp2 = `t${temp}`;
        temp++;
        let temp3 = `t${temp}`;
        temp++;
        let label1 = `L${label}`;
        label++;
        let label2 = `L${label}`;
        label++;
        let label3 = `L${label}`;
        label++;
        let label4 = `L${label}`;
        label++;
        let label5 = `L${label}`;
        label++;

        code.push(`${temp1} = ${val1};`);
        code.push(`${temp2} = ${val2};`);
        code.push(`if (${temp1} == 1) goto ${label1};`);
        code.push(`goto ${label2};`);
        code.push(`${label1}:`)
        code.push(`if (${temp2} == 0) goto ${label3}; # true xor`);
        code.push(`goto ${label4}; # false xor`);
        code.push(`${label2}:`);
        code.push(`if (${temp2} == 0) goto ${label4};`);
        code.push(`${label3}:`);
        code.push(`${temp3} = 1;`)
        code.push(`goto ${label5};`);
        code.push(`${label4}:`);
        code.push(`${temp3} = 0;`);
        code.push(`${label5}:`);

        return {
            code: code.join('\n'),
            label: label,
            temp: temp,
            val: temp3
        }
    }

    generateEString3DC(val1, val2, label, temp) {
        let code = [];
        let temp1 = `t${temp}`;
        temp++;
        let temp2 = `t${temp}`;
        temp++;
        let temp3 = `t${temp}`;
        temp++;
        let temp4 = `t${temp}`;
        temp++;
        let temp5 = `t${temp}`;
        temp++;
        let label1 = `L${label}`;
        label++;
        let label2 = `L${label}`;
        label++;
        let label3 = `L${label}`;
        label++;
        let label4 = `L${label}`;
        label++;

        code.push(`${temp1} = ${val1};`);
        code.push(`${temp2} = ${val2};`);
        code.push(`${label1}:`);
        code.push(`${temp3} = heap[${temp1}];`);
        code.push(`${temp4} = heap[${temp2}];`);
        code.push(`if (${temp3} <> ${temp4}) goto ${label2};`);
        code.push(`if (${temp3} == 0) goto ${label3};`);
        code.push(`${temp1} = ${temp1} + 1;`);
        code.push(`${temp2} = ${temp2} + 1;`);
        code.push(`goto ${label1};`);
        code.push(`${label2}:`);
        code.push(`${temp5} = 0;`);
        code.push(`goto ${label4};`);
        code.push(`${label3}:`);
        code.push(`${temp5} = 1;`);
        code.push(`${label4}:`);

        return {
            code: code.join('\n'),
            temp: temp,
            label: label,
            val: temp5
        }
    }

    generateNEString3DC(val1, val2, label, temp) {
        let code = [];
        let temp1 = `t${temp}`;
        temp++;
        let temp2 = `t${temp}`;
        temp++;
        let temp3 = `t${temp}`;
        temp++;
        let temp4 = `t${temp}`;
        temp++;
        let temp5 = `t${temp}`;
        temp++;
        let label1 = `L${label}`;
        label++;
        let label2 = `L${label}`;
        label++;
        let label3 = `L${label}`;
        label++;
        let label4 = `L${label}`;
        label++;

        code.push(`${temp1} = ${val1};`);
        code.push(`${temp2} = ${val2};`);
        code.push(`${label1}:`);
        code.push(`${temp3} = heap[${temp1}];`);
        code.push(`${temp4} = heap[${temp2}];`);
        code.push(`if (${temp3} <> ${temp4}) goto ${label2};`);
        code.push(`if (${temp3} == 0) goto ${label3};`);
        code.push(`${temp1} = ${temp1} + 1;`);
        code.push(`${temp2} = ${temp2} + 1;`);
        code.push(`goto ${label1};`);
        code.push(`${label2}:`);
        code.push(`${temp5} = 1;`);
        code.push(`goto ${label4};`);
        code.push(`${label3}:`);
        code.push(`${temp5} = 0;`);
        code.push(`${label4}:`);

        return {
            code: code.join('\n'),
            temp: temp,
            label: label,
            val: temp5
        }
    }
}

module.exports.Binary =  Binary;
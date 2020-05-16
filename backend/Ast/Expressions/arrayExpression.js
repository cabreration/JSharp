const Singleton = require('../../Procesor/Singleton/singleton').Singleton;
const SharpError = require('../../Procesor/Singleton/sharpError').SharpError;
const Updater = require('../Utilities/updater').Updater;

class ArrayExpression {
    constructor(exp_list, type, size, row, column) {
        this.exp_list = exp_list; // nodeList -> [ expression ]
        this.type = type; // type
        this.size = size; // expression
        this.row = row;
        this.column = column;
    }

    getDot() {
        return '[label="ARRAY EXPRESSION"];\n';
    }

    getChildren() {
        if (this.exp_list != null) {
            return [ this.exp_list ];
        }
        else if (this.type != null) {
            return [ this.type, this.size ]
        }
        else {
            return [];
        }
    }

    getTypeOf() {
        return 'arrayexpression';
    }

    checkType(env) {
        if (this.type != null) {
            return this.type.name+'[]';
        }
        else {
            let values = this.exp_list.getChildren();
            let official = null;
            for (let i = 0; i < values.length; i++) {
                let current = values[i];
                let aux = current.checkType(env);
                if (typeof(aux)=='object') {
                    return aux;
                }

                if (official == null) {
                    official = aux;
                }
                else {
                    if (official != aux) {
                        if (official == 'char' && (aux == 'double' || aux == 'int')) {
                            official = aux;
                        }
                        else if (official == 'int' && aux == 'double') {
                            official = aux;
                        }
                        else if (official == 'double' && (aux != 'int' && aux != 'char')) {
                            return new SharpError("Semantico", `Un arreglo de tipo ${official} no puede contener valores de tipo ${aux}`, this.row, this.column);
                        }
                        else if (official == 'int') {
                            return new SharpError("Semantico", `Un arreglo de tipo ${official} no puede contener valores de tipo ${aux}`, this.row, this.column);
                        }
                        else {
                            return new SharpError("Semantico", `Un arreglo de tipo ${official} no puede contener valores de tipo ${aux}`, this.row, this.column);
                        }
                    }
                }
            }
            return official+'[]';
        }
    }

    getTDC(env, label, temp) {
        // tenemos dos cases
        let code = [];
        if (this.exp_list == null) {
            // evaluamos size
            let sizeType = this.size.checkType(env);
            if (typeof(sizeType)=='object') {
                Singleton.insertError(sizeType);
                return new Updater(env, label, temp, null);
            }

            if (sizeType != 'int' && sizeType != 'char') {
                let er = new SharpError("Semantico", `El tamanio de un arreglo solo puede ser definido por valores de tipo integer, se proveyo ${sizeType}`, this.row, this.column);
                Singleton.insertError(er);
                return new Updater(env, label, temp, null);
            }

            // 3d del tamanio
            let sizeTDC = this.size.getTDC(env, label, temp);
            if (sizeTDC.value == null) {
                console.log("Esto no deberia estar pasando, arrayExpression");
                console.log(sizeTDC);
                return new Updater(env, label, temp, null);
            }
            if (sizeTDC.code != null) {
                code.push(sizeTDC.code);
                temp = sizeTDC.temp;
                label = sizeTDC.label;
            }

            let runner = `t${temp}`;
            temp++;
            let val = `t${temp}`;
            temp++;

            let label1 = `L${label}`;
            label++;
            let label2 = `L${label}`;
            label++;

            code.push(`${val} = h;`);
            code.push(`${runner} = ${sizeTDC.value};`);
            code.push(`heap[h] = ${runner};`);
            code.push(`${label1}:`);
            code.push(`if (${runner} == 0) goto ${label2};`);
            code.push(`heap[h] = 0;`);
            code.push('h = h + 1;');
            code.push(`${runner} = ${runner} - 1;`);
            code.push(`goto ${label1};`);
            code.push(`${label2}:`);

            let up = new Updater(env, label, temp, code.join('\n'));
            up.addValue(val);
            up.addType(this.type.name + '[]');
            return up;
        }
        else {
            let arrayType = this.checkType(env);
            let val = `t${temp}`;
            temp++;
            code.push(`${val} = h;`);
            code.push(`heap[h] = ${this.exp_list.getChildren().length};`);
            for (let i = 0; i < this.exp_list.getChildren().length; i++) {
                // agregamos el td de cada una de las expresiones
                let now = this.exp_list.getChildren()[i];
                let td = now.getTDC(env, label, temp);
                if (td.value == null) {
                    return new Updater(env, label, temp, null);
                }
                if (td.code != null) {
                    code.push(td.code);
                    temp = td.temp;
                    label = td.label;
                }
                code.push(`heap[h] = ${td.value};`);
                code.push(`h = h + 1;`)
            }

            let up = new Updater(env, label, temp, code.join('\n'));
            up.addValue(val);
            up.addType(arrayType);
            return up;
        }
    }
}

module.exports.ArrayExpression = ArrayExpression;
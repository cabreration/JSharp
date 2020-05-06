const Singleton = require('../../Procesor/Singleton/singleton').Singleton;
const SharpError = require('../../Procesor/Singleton/sharpError').SharpError;
const Updater = require('../Utilities/updater').Updater;

class Attribute {
    
    constructor(type, identifier, expression) {
        this.type = type; //Type
        this.identifier = identifier; //Identifier
        this.expression = expression; // expression
    }

    getChildren() {
        if (this.expression == null)
            return [ this.type, this.identifier ];
        else 
            return [this.type, this.identifier, this.expression];
    }

    getDot() {
        return '[label="ATTRIBUTE"];\n';
    }

    getTypeOf() {
        return 'attribute';
    }

    validateAttribute() {
        switch(this.type.name) {
            case "int":
            case "double":
            case "char":
            case "boolean":
            case 'string':
            case 'int[]':
            case 'double[]':
            case 'char[]':
            case 'boolean[]':
            case 'string[]':
                return true;
        }

        let objType = this.type.name.slice(0);
        if (this.type.arrayFlag) {
            objType = this.objType.slice(0, -2);
        }

        let type = Singleton.getStrc(objType);
        if (type == null) {
            return new SharpError('Semantico', `El tipo de dato ${this.type.name} no ha sido definido`, this.type.row, this.type.column);
        }

        return true;
    }

    getTDC(env, label, temp, h) {
        let code = [];
        if (this.expression != null) {
            let expType = this.expression.checkType(env);
            if (expType != this.type.name) {
                if (this.type.name == 'double') {
                    if (expType != 'int' && expType != 'char') {
                        Singleton.insertError(new SharpError('Semantico', `El valor que se desea agregar a ${this.identifier.id} no es casteable de forma implicita`, this.identifier.row, this.identifier.column));
                        return new Updater(env, label, temp, null);
                    }
                }
                else if (this.type.name == 'int') {
                    if (expType != 'char') {
                        Singleton.insertError(new SharpError('Semantico', `El valor que se desea agregar a ${this.identifier.id} no es casteable de forma implicita`, this.identifier.row, this.identifier.column));
                        return new Updater(env, label, temp, null);
                    }
                }
                else if (this.type.name === 'double[]') {
                    if (expType != 'int[]' && expType != 'char[]') {
                        Singleton.insertError(new SharpError('Semantico', `El valor que se desea agregar a ${this.identifier.id} no es casteable de forma implicita`, this.identifier.row, this.identifier.column));
                        return new Updater(env, label, temp, null);
                    }
                }
                else if (this.type.name === 'int[]') {
                    if (expType != 'char[]') {
                        Singleton.insertError(new SharpError('Semantico', `El valor que se desea agregar a ${this.identifier.id} no es casteable de forma implicita`, this.identifier.row, this.identifier.column));
                        return new Updater(env, label, temp, null);
                    }
                }
            }

            // once we checked the expression we can asign it
            let expTDC = this.expression.getTDC(env, label, temp);
            if (expTDC.value == null) {
                return expTDC;
            }
            if (expTDC.code != null) {
                code.push(expTDC.code);
            }
            label = expTDC.label;
            temp = expTDC.temp;
            let val = expTDC.value;

            code.push(`heap[${h}] = ${val};`);
            code.push(`${h} = ${h} + 1;`);
        }
        else {
            code.push(`heap[${h}] = 0;`);
            code.push(`${h} = ${h} + 1;`);
        }

        return new Updater(env, label, temp, code.join('\n'));
    }
}

module.exports.Attribute = Attribute;
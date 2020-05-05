const SharpError = require('../../Procesor/Singleton/sharpError').SharpError;

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
}

module.exports.Unary =  Unary;
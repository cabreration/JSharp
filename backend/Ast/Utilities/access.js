const Singleton = require('../../Procesor/Singleton/singleton').Singleton;
const SharpError = require('../../Procesor/Singleton/sharpError').SharpError;
const Updater = require('../Utilities/updater').Updater;

class Access {

    constructor(type, lead, row, column) {
        this.type = type; // 1 - attribute, 2 - array, 3 - function
        this.lead = lead; // 1 - Id, 2 - Expression, 3 - Call
        this.row = row;
        this.column = column;
        this.parentType = null;
        this.myType = null;
    }

    addParentType(type) {
        this.parentType = type;
    }

    getChildren() {
        return [ this.lead ];
    }

    getDot() {
        return `[label="ACCESS: ${this.type === 1 || this.type === 3 ? '.'+this.lead : '['+this.lead+']'}"];\n`;
    }

    getTypeOf() {
        return 'access';
    }

    getTDC(env, label, temp) {
        let code = [];
        if (this.type === 1) {
            // attribute
        }
        else if (this.type === 2) {
            // array position
            let arrayType = this.lead.checkType(env);
            if (typeof(arrayType) === 'object') {
                Singleton.insertError(arrayType);
                return new Updater(env, label, temp, null);
            }

            if (arrayType != 'int' && arrayType != 'char') {
                Singleton.insertError('Semantico', 'Solamente puede accederse a indices de arreglos con numeros enteros', this.row, this.column);
                return new Updater(env, label, temp, null);
            }

            let tdc = this.lead.getTDC(env, label, temp);
            if (tdc.value == null) {
                console.log("Esto no deberia estar pasando en Access.js");
                return new Updater(env, label, temp, null);
            }

            return tdc;
        }
        else {
            // function call
        }
    }
}

module.exports.Access = Access;
const Updater = require('../Utilities/updater').Updater;
const Singleton = require('../../Procesor/Singleton/singleton').Singleton;
const SharpError = require('../../Procesor/Singleton/sharpError').SharpError;

class VarT1 {

    constructor(type, ids, expression) {
        this.type = type; // Type
        this.ids = ids; // NodeList
        this.expression = expression; // Expression
    }

    getDot() {
        return '[label="VARIABLE DECLARATION - T1"];\n';
    }

    getChildren() {
        return [ this.type, this.ids, this.expression ];
    }

    getTypeOf() {
        return 'vart1';
    }

    getTDC(env, label, temp) {
        // check declaration type
        let validate1 = Singleton.validateType(this.type.name);
        if (!validate1) {
            Singleton.insertError(new SharpError('Semantico', `El tipo ${this.type.name} no ha sido definido`, this.type.row, this.type.column));
            return new Updater(env, label, temp, null);
        }
        // validate expression
        let expType = this.expression.checkType(env.id); 
        if (typeof(expType) === 'object') {
            Singleton.insertError(expType);
            return new Updater(env, label, temp, null);
        }
        // validate the type of expression is the same as the declaration type
        if (this.type.name != expType) {
            // manage implicit casting
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
                Singleton.insertError(new SharpError('Semantico', 'Los tipos de la declaracion y expresion no concuerdan', this.type.row, this.type.column));
                return new Updater(env, label, temp, null);
            }
        } 
        // get the expression 3DC
        let code = [];
        let fUpdater = this.expression.getTDC(env, label, temp);
        let expValue = fUpdater.value;
        env = fUpdater.env;
        label = fUpdater.label;
        temp = fUpdater.temp;
        if (fUpdater.code != null)
            code.push(fUpdater.code);

        // generate the code
        let vars = this.ids.getChildren();
        vars.forEach(id => {
            let symbol = env.getSymbol(id.id);
            if (symbol.state) {
                let pos = symbol.lead.position;
                let role = symbol.lead.role;
                if (role === 'global var') {
                    code.push(`heap[${pos}] = ${expValue};`);
                }
                else if (role === 'local var') {
                    code.push(`t${temp} = p + ${pos};`);
                    code.push(`stack[t${temp}] = ${expValue};`);
                    code.push('p = p + 1;');
                    temp++;
                }
                else {
                    console.error(role);
                    console.error('ERROR DE PROGRA EN vart5.js');
                }
            }
        });
        if (code.length === 0) {
            return new Updater(env, label, temp, null);
        }
        else {
            let cod = code.join('\n');
            return new Updater(env, label, temp, cod);
        }
        
    }
}

module.exports.VarT1 = VarT1;
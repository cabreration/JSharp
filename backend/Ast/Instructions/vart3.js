const Updater = require('../Utilities/updater').Updater;
const Singleton = require('../../Procesor/Singleton/singleton').Singleton;

class VarT3 {
    // const
    constructor(identifier, expression) {
        this.identifier = identifier; // Identifier
        this.expression = expression; // Expression
    }

    getDot() {
        return '[label="VARIABLE DECLARATION - T3"];\n';
    }

    getChildren() {
        return [ this.identifier, this.expression ];
    }

    getTypeOf() {
        return 'vart3';
    }

    getTDC(env, label, temp) {
        // validate expression
        let expType = this.expression.checkType(env);
        if (typeof(expType) === 'object') {
            Singleton.insertError(expType);
            return new Updater(env, label, temp, null);
        }

        // change type of symbol
        let symbol = env.getSymbol(this.identifier.id);
        if (!symbol.state) {
            return new Updater(env, label, temp, null);
        }
        symbol.lead.type = expType;

        // get the code 
        let code = [];
        let fUpdater = this.expression.getTDC(env, label, temp);
        let expValue = fUpdater.value;
        env = fUpdater.env;
        label = fUpdater.label;
        temp = fUpdater.temp;
        if (fUpdater.code != null)
            code.push(fUpdater.code);

        let pos = symbol.lead.position;
        let role = symbol.lead.role;
        if (role === 'global var') {
            code.push(`heap[${pos}] = ${expValue};`);
            symbol.lead.setActive();
        }
        else if (role === 'local var') {
            code.push(`t${temp} = p + ${pos};`);
            code.push(`stack[t${temp}] = ${expValue};`);
            temp++;
            symbol.lead.setActive();
        }
        else {
            console.error(role);
            console.error('ERROR DE PROGRA EN vart2.js');
        }
        if (code.length === 0) {
            return new Updater(env, label, temp, null);
        }
        else {
            return new Updater(env, label, temp, code.join('\n'));
        }
    }
}

module.exports.VarT3 = VarT3;
const Singleton = require('../../Procesor/Singleton/singleton').Singleton;
const SharpError = require('../../Procesor/Singleton/sharpError').SharpError;
const Updater = require('../Utilities/updater').Updater;

class Identifier {
    constructor(id, row, column) {
        this.id = id; // String
        this.row = row; // Number
        this.column = column; // Number
        this.byValue = false;
    }

    byValue() {
        this.byValue = true;
    }

    getChildren() {
        return [];
    }

    getDot() {
        return '[label="' + this.id + '"];\n';
    }

    getTypeOf() {
        return 'identifier';
    }

    checkType(envId) {
        let thenv= envId.id;
        while (envId != null) {
            let enviroment = Singleton.getEnviroment(thenv);
            let res = enviroment.getSymbol(this.id);
            if (res.state) {
                return res.lead.type;
            }
            else {
                thenv = res.lead;
                if (thenv == null) {
                    return new SharpError('Semantico', 'La variable "' + this.id + '" no existe en el contexto actual', this.row, this.column);
                }
            }
        }
    }

    getTDC(env, label, temp) {
        let code = [];
        // get the position and type from the enviroment
        let envId = env.id;
        let symbol;
        let counter = 0;
        let spaces = 0;
        do {
            let currentEnv = Singleton.getEnviroment(envId);
            symbol = currentEnv.getSymbol(this.id);
            envId = symbol.lead;
            counter++;
            if (counter > 1)
                spaces += currentEnv.last;
        }
        while (!symbol.state)

        // get the value and type
        let type = symbol.lead.type;
        let role = symbol.lead.role;
        let position = symbol.lead.position;
        let val;
        if (role === 'global var') {
            code.push(`t${temp} = heap[${position}];`);
            val = `t${temp}`;
            temp++;
        }
        else {
            if (counter > 1) {
                code.push(`t${temp} = p - ${spaces};`);
                temp++;
                code.push(`t${temp} = t${temp - 1} + ${position}`);
                temp++;
                code.push(`t${temp} = stack[t${temp - 1}];`);
                val = `t${temp}`;
                temp++;
            }
            else {
                code.push(`t${temp} = p + ${position};`);
                temp++;
                code.push(`t${temp} = stack[${temp-1}];`);
                val = `t${temp}`;
                temp++;
            }
        }
        let updater = new Updater(env, label, temp, code.join('\n'));
        updater.addValue(val);
        updater.addType(type);
        return updater;
    }

}

module.exports.Identifier = Identifier;
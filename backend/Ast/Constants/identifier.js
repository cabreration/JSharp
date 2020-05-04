const Singleton = require('../../Procesor/Singleton/singleton').Singleton;
const SharpError = require('../../Procesor/Singleton/sharpError').SharpError;

class Identifier {
    constructor(id, row, column) {
        this.id = id; // String
        this.row = row; // Number
        this.column = column; // Number
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
        while (envId != null) {
            let enviroment = Singleton.getEnviroment(envId);
            let res = enviroment.getSymbol(this.id);
            if (res.state) {
                return res.lead.type;
            }
            else {
                envId = res.lead;
                if (envId == null) {
                    return new SharpError('Semantico', 'La variable "' + this.id + '" no existe en el contexto actual', this.row, this.column);
                }
            }
        }
    }

    getTDC(env, label, temp) {
        // TODO
    }

}

module.exports.Identifier = Identifier;
const Updater = require('../Utilities/updater').Updater;
const Singleton = require('../../Procesor/Singleton/singleton').Singleton;

class VarT5 {

    constructor(type, ids) {
        this.type = type; // Type
        this.ids = ids; // NodeList - Identifiers
    }

    getDot() {
        return '[label="VARIABLE DECLARATION - T5"];\n';
    }

    getChildren() {
        return [ this.type, this.ids ];
    }

    getTypeOf() {
        return 'vart5';
    }

    getTDC(env, label, temp, h, p) {
        // Since its only a declaration im not gonna verify the declaration type, until it is asigned
        let code = [];
        let vars = this.ids.getChildren();
        vars.forEach(id => {
            let symbol = env.getSymbol(id.id);
            if (symbol.state) {
                let pos = symbol.lead.position;
                let role = symbol.lead.role;
                if (role === 'global var') {
                    code.push(`heap[${pos}] = 0;`);
                    Singleton.heap[pos] = 0;
                }
                else if (role === 'local var') {
                    code.push(`t${temp} = p + ${pos};`);
                    code.push(`stack[t${temp}] = 0;`);
                    code.push('p = p + 1;')
                    temp++;
                    p++;
                    Singleton.stack.push(0);
                }
                else {
                    console.error(role);
                    console.error('ERROR DE PROGRA EN vart5.js');
                }
            }
        });
        if (code.length === 0) {
            return new Updater(env, label, temp, h, p, null);
        }
        else {
            let cod = code.join('\n');
            return new Updater(env, label, temp, h, p, cod);
        }
        
    }
}

module.exports.VarT5 = VarT5;

const SymbolsTable = require('./Table/symbolsTable').SymbolsTable;
const Enviroment = require('./Table/enviroment').Enviroment;
const Symbol = require('./Table/symbol').Symbol;

class TreeProcesor {
    constructor() {
        this.position = 0;
        this.envCount = 1;
        this.table = new SymbolsTable(new Enviroment('global', 'global', null, false, 0));
    }

    processTree(instructions) {
        let global = this.table[0];
        instructions.forEach(ins => {
            switch(ins.getTypeOf()) {
                case 'vart1':
                    this.processVarT1(global, ins);
                    break;
                case 'vart2':
                    this.processVarT234(global, ins, 2);
                    break;
                case 'vart3':
                    this.processVarT234(global, ins, 3);
                    break;
                case 'vart4':
                    this.processVarT234(globa, ins, 4);
                    break;
                case 'vart5':
                    this.processVarT1(global, ins);
                    break;
            }
        });
    }

    processVarT1(env, ins) {
        let type = ins.type;
        let ids = ins.ids;
        ids.forEach(id =>{
            let symbol = new Symbol(id, env.id === 'global' ? 'global var' : 'local var', type, this.position, env.id);
            let res = env.addSymbol(symbol);
            if (res === true)
                this.position++;
        });
    }

    processVarT234(env, ins, opt) {
        let type = opt === 2 ? 'var' : opt === 3 ? 'const' : 'global';
        let id = ins.identifier;
        let role;
        if (env.id === 'global') {
            role = 'global var';
        }
        else {
            role = opt === 2 || opt === 3 ? 'local var' : 'global var';
        }
        let symbol = new Symbol(id, role, type, this.position, env.id);
        let res = env.addSymbol(symbol);
        if (res === true)
            this.position++;
    }
}

module.exports.TreeProcesor = TreeProcesor;
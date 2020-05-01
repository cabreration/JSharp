
const SymbolsTable = require('./Table/symbolsTable').SymbolsTable;
const Enviroment = require('./Table/enviroment').Enviroment;
const Symbol = require('./Table/symbol').Symbol;

class TreeProcesor {
    constructor() {
        this.position = 0;
        this.envCount = 1;
        this.table = new SymbolsTable(new Enviroment('global', 'global', null, false, 0));
    }

    firstApproach(ast) {
        // process all of the structure definitions first
        this.processStrc(ast.global_strcs);
        // process all of the global variables second
        this.processTree(ast.global_vars);
        // process all of the global array variables third
        // process all of the function declarations last
        this.processFunctions(ast.functions_list);
    }

    processStrc(strc_list) {
        let global = this.table[0];
        strc_list.forEach(strc => {
            let sym = Symbol.generateStrcSymbol(strc.identifier.id);
            strc.attributes.getChildren().forEach(att => {
                let r = sym.addAttribute(strc.type.name, strc.id.id);
                if (!r) {
                    // INSERT ERROR - ANOTHER ATTRIBUTE HAS THE SAME NAME
                    return;
                }
            });
            let r2 = global.addSymbol(sym);
            if (!r2) {
                // INSERT ERROR - ANOTHER STRC WITH THE SAME NAME ALREADY EXISTS
            }
        });
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
            else {
                // INSERT ERROR HERE - VARIABLE ALREADY DECLARED
            }
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
        else {
            // INSERT ERROR - VARIABLE ALREADY DECLARED
        }
    }

    processFunctions(functions) {
        let global = this.table[0];
        functions.forEach(proc => {
            this.position = 1;
            let id = proc.id;
            let type = proc.type;
            let parameters = proc.parameters.getChildren();
            let procEnv = global.generateFuncEnviroment(id.id, type.name, parameters.length);
            parameters.forEach(param => {
                let sym = new Symbol(param.identifier.id, 'parameter', param.type.name, this.position, procEnv.id);
                let r = procEnv.addSymbol(sym);
                if (r)
                    this.position++;
                else {
                    // INSERT ERROR - PARAMETER ALREADY EXISTS
                    return;
                }
            });

            let res = this.table.insertEnviroment(procEnv);
            if (!res) {
                // INSERT ERROR - FUNCTION ALREADY EXISTS
                return;
            }
        });
    }
}

module.exports.TreeProcesor = TreeProcesor;
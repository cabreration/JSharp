const Singleton = require('./Singleton/singleton').Singleton;
const SharpError = require('./Singleton/sharpError').SharpError;
const Enviroment = require('./Symbols/enviroment').Enviroment;
const Symbol = require('./Symbols/symbol').Symbol;

class Process {
    constructor() {
        this.position = 0;
        this.envCount = 1;
    }

    firstApproach(ast) {
        // first we process all of the strc definitions in the global enviroment
        this.processStrc(ast.global_strcs);

        // next we process all the global variables and arrays
        let global = new Enviroment('global', 'global', null, false, 0, -1, -1);
        this.processInstructions(ast.global_vars, global);
        Singleton.insertEnviroment(global);

        // finally we process all of the functions and methods
        this.processFunctions(ast.functions_list);
    }

    processStrc(defs) {
        defs.forEach(strc => {
            // we validate the attributes do not have repeated names
            let ans = strc.validateAttributesAreNotRepeated();
            if (ans.res) {
                Singleton.insertStrcDef(strc);
            }
            else {
                Singleton.inserError(new SharpError('Semantico',
                 'Ya existe un atributo denominado "' + ans.id +'"',
                 res.row,
                 res.col));
            }
        });
    }   

    processInstructions(instructions, env) {
        instructions.forEach(ins => {
            switch(ins.getTypeOf()) {
                case 'vart1':
                    this.processVarT15(env, ins);
                    break;
                case 'vart2':
                    this.processVarT234(env, ins, 2);
                    break;
                case 'vart3':
                    this.processVarT234(env, ins, 3);
                    break;
                case 'vart4':
                    this.processVarT234(env, ins, 4);
                    break;
                case 'vart5':
                    this.processVarT15(env, ins);
                    break;
            }
        });
    }

    processVarT15(env, ins) {
        let type = ins.type;
        let ids = ins.ids;
        ids.forEach(id =>{
            let symbol = new Symbol(id.id, env.id === 'global' ? 'global var' : 'local var', type, this.position, env.id, id.row, id.column);
            let res = env.addSymbol(symbol);
            if (res === true)
                this.position++;
            else {
                Singleton.inserError(new SharpError('Semantico',
                    'La variable "' + id.id +'" ya ha sido definida en el contexto actual', id.row, id.column));
            }
        });
    }

    processVarT234(env, ins, opt) {
        let type = opt === 2 ? 'var' : opt === 3 ? 'const' : 'global';
        let id = ins.identifier;
        let role;
        if (env.id === 'global') {
            role = 'global var';
            let global = Singleton.getEnviroment('global');
            let res = global.containsSymbol(id.id);
            if (res) {
                Singleton.insertError(new SharpError('Semantico',
                    'La variable "' + id.id + '" ya ha sido definida en el contexto global', id.row, id.column));
                return;
            }
        }
        else {
            role = opt === 2 || opt === 3 ? 'local var' : 'global var';
        }
        let symbol = new Symbol(id.id, role, type, this.position, env.id);
        let res = env.addSymbol(symbol);
        if (res === true)
            this.position++;
        else {
            Singleton.insertError(new SharpError('Semantico',
                    'La variable "' + id.id + '" ya ha sido definida en el contexto actual', id.row, id.column));
        }
    }

    processFunctions(functions) {
        let global = Singleton.getEnviroment('global');
        functions.forEach(proc => {
            this.position = 1;
            let id = proc.id;
            let type = proc.type;
            let parameters = proc.parameters.getChildren();
            let procEnv = global.generateProcEnviroment(id.id, type.name, parameters.length, id.row, id.column);
            parameters.forEach(param => {
                let sym = new Symbol(param.identifier.id, 'parameter', param.type.name, this.position, procEnv.id);
                let r = procEnv.addSymbol(sym);
                if (r)
                    this.position++;
                else {
                    Singleton.insertError(new SharpError('Semantico',
                    'El parametro "' + param.identifier.id + '" ya ha sido definido', param.identifier.row, param.identifier.column));
                    return;
                }
            });

            Singleton.insertEnviroment(procEnv);
            // Gotta process the instructions of every procedure
        });
    }
}

module.exports.Process = Process;
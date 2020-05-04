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
        global = Singleton.insertEnviroment(global);
        this.processInstructions(ast.global_vars, global);

        // finally we process all of the functions and methods
        this.processFunctions(ast.functions_list);
    }

    processStrc(defs) {
        defs.forEach(strc => {
            this.processOneStrc(strc);
        });
    }   

    processOneStrc(strc) {
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
                case "strc":
                    this.processOneStrc(ins);
                    break;
                case "ifsentence":
                    let ifEnv = env.generateSubEnviroment(env.id+'-if', 'if sentence');
                    this.processInstructions(ins.sentences.getChildren(), ifEnv);
                    Singleton.insertEnviroment(ifEnv);
                    break;
                case 'elseSentence':
                    let elseEnv = env.generateSubEnviroment(env.id+'-else', 'else sentence');
                    this.processInstructions(ins.sentences.getChildren(), elseEnv);
                    Singleton.insertEnviroment(elseEnv);
                    break;
                case 'whilesentence':
                    let whileEnv = env.generateSubEnviroment(env.id+'-while', 'while sentence');
                    this.processInstructions(ins.sentences.getChildren(), whileEnv);
                    Singleton.insertEnviroment(whileEnv);
                    break;
                case 'dowhile':
                    let dowhileEnv = env.generateSubEnviroment(env.id+'-dowhile', 'dowhile sentence');
                    this.processInstructions(ins.sentences.getChildren(), dowhileEnv);
                    Singleton.insertEnviroment(dowhileEnv);
                    break;
                case 'trycatchsentence':
                    let tryEnv = env.generateSubEnviroment(env.id+'-try', 'try block');
                    this.processInstructions(ins.trySentences.getChildren(), tryEnv);
                    Singleton.insertEnviroment(tryEnv);
                    let catchEnv = env.generateSubEnviroment(env.id+'-catch', 'catch block');
                    this.processVarT15(catchEnv, ins.exception);
                    this.processInstructions(ins.catchSentences.getChildren(), catchEnv);
                    Singleton.insertEnviroment(catchEnv);
                    break;
                case 'forsentence':
                    let forEnv = env.generateSubEnviroment(env.id+'-for', 'for sentence');
                    // agregar la primer variable
                    this.processInstructions(ins.sentences.getChildren(), forEnv);
                    Singleton.insertEnviroment(forEnv);
                    break;
                case 'switchsentence':
                    let switchEnv = env.generateSubEnviroment(env.id+'-switch', 'switch sentence');
                    ins.cases.getChildren().forEach(kase => {
                        this.processInstructions(kase.sentences.getChildren(), switchEnv);
                    });
                    Singleton.insertEnviroment(switchEnv);
                    break;
            }
        });
    }

    processVarT15(env, ins) {
        let type = ins.type;
        let ids = ins.ids.getChildren();
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
            let res;
            if (global == null || global == undefined)
                res = env.containsSymbol(id.id);
            else
                res = global.containsSymbol(id.id);
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
        if (opt === 3) {
            symbol.isConstant();   
        }
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
            let procEnv = global.generateProcEnviroment(id.id+'_'+type.name+'_'+parameters.length, type.name, parameters.length, id.row, id.column);
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

            procEnv = Singleton.insertEnviroment(procEnv);
            if (procEnv != null) {
                // Gotta process the instructions of every procedure
                let sentences = proc.sentences.getChildren();
                this.processInstructions(sentences, procEnv);
            }
        });
    }
}

module.exports.Process = Process;
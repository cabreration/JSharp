const Singleton = require('./Singleton/singleton').Singleton;
const SharpError = require('./Singleton/sharpError').SharpError;
const Enviroment = require('./Symbols/enviroment').Enviroment;
const Symbol = require('./Symbols/symbol').Symbol;
const parser = require('../Ast/Jison/grammar');
const fs = require('fs');
let approvedFunctions = [];
let vars = [];

class Process {
    constructor() {
        this.position = 1;
        this.envCount = 1;
    }

    firstApproach(ast) {
        approvedFunctions = [];
        vars = [];
        // first we process all of the strc definitions in the global enviroment
        this.processStrc(ast.global_strcs);

        // next we process all the global variables and arrays
        let global = new Enviroment('global', 'global', null, false, 0, -1, -1);
        global.last = 1;
        global = Singleton.insertEnviroment(global);
        this.processInstructions(ast.global_vars, global, true);

        // finally we process all of the functions and methods
        this.processFunctions(ast.functions_list);

        // here we should process all of the imports
        let added = this.processImports(ast);

        return {
            functions_list: approvedFunctions,
            global_vars: vars
        }
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
                ans.row,
                ans.col));
        }
    }

    processInstructions(instructions, env, global) {
        for (let i = 0; i < instructions.length; i++) {
            let ins = instructions[i];
            switch(ins.getTypeOf()) {
                case 'vart1':
                    this.processVarT15(env, ins, global);
                    break;
                case 'vart2':
                    this.processVarT234(env, ins, 2, global);
                    break;
                case 'vart3':
                    this.processVarT234(env, ins, 3, global);
                    break;
                case 'vart4':
                    this.processVarT234(env, ins, 4, global);
                    break;
                case 'vart5':
                    this.processVarT15(env, ins, global);
                    break;
                case 'sharparray':
                    this.processVarT15(env, ins, global);
                    break;
                case "strc":
                    this.processOneStrc(ins);
                    break;
                case "ifsentence":
                    ins.inEnv = i;
                    let ifEnv = env.generateSubEnviroment(env.id+i+'-if', 'if sentence');
                    let sti = this.position;
                    this.position = 0;
                    this.processInstructions(ins.sentences.getChildren(), ifEnv);
                    this.position = sti;
                    Singleton.insertEnviroment(ifEnv);
                    let elseIns = ins.elseSentence;
                    let counter  = 1;
                    while (elseIns != null) {
                        elseIns.inEnv = i;
                        let elseEnv = env.generateSubEnviroment(env.id+i+'-else'+counter, 'else sentence');
                        counter++;
                        let ste = this.position;
                        this.position = 0;
                        this.processInstructions(elseIns.sentences.getChildren(), elseEnv);
                        this.position = ste;
                        Singleton.insertEnviroment(elseEnv);
                        elseIns = elseIns.elseSentence;
                    }
                    break;
                case 'whilesentence':
                    ins.inEnv = i;
                    let whileEnv = env.generateSubEnviroment(env.id+i+'-while', 'while sentence');
                    let stw = this.position;
                    this.position = 0;
                    this.processInstructions(ins.sentences.getChildren(), whileEnv);
                    this.position = stw;
                    Singleton.insertEnviroment(whileEnv);
                    break;
                case 'dowhilesentence':
                    ins.inEnv = i;
                    let dowhileEnv = env.generateSubEnviroment(env.id+i+'-dowhile', 'dowhile sentence');
                    let std = this.position;
                    this.position = 0;
                    this.processInstructions(ins.sentences.getChildren(), dowhileEnv);
                    this.position = std;
                    Singleton.insertEnviroment(dowhileEnv);
                    break;
                case 'trycatchsentence':
                    ins.inEnv = i;
                    let tryEnv = env.generateSubEnviroment(env.id+i+'-try', 'try block');
                    let stt = this.position;
                    this.position = 0;
                    this.processInstructions(ins.trySentences.getChildren(), tryEnv);
                    this.position = stt;
                    Singleton.insertEnviroment(tryEnv);
                    let catchEnv = env.generateSubEnviroment(env.id+'-catch', 'catch block');
                    this.processVarT15(catchEnv, ins.exception);
                    let stc = this.position;
                    this.position = 0;
                    this.processInstructions(ins.catchSentences.getChildren(), catchEnv);
                    this.position = stc;
                    Singleton.insertEnviroment(catchEnv);
                    break;
                case 'forsentence':
                    ins.inEnv = i;
                    let forEnv = env.generateSubEnviroment(env.id+i+'-for', 'for sentence');
                    // add the the for start if this is a declaration
                    let stf = this.position;
                    this.position = 0;
                    if (ins.start.getChildren().length > 0 && ins.start.getChildren()[0].getTypeOf() === 'vart1') {
                        this.processInstructions(ins.start.getChildren(), forEnv);
                    }
                    this.processInstructions(ins.sentences.getChildren(), forEnv);
                    this.position = stf;
                    Singleton.insertEnviroment(forEnv);
                    break;
                case 'switchsentence':
                    ins.inEnv = i;
                    let switchEnv = env.generateSubEnviroment(env.id+i+'-switch', 'switch sentence');
                    let sts = this.position;
                    this.position = 0;
                    ins.cases.getChildren().forEach(kase => {
                        this.processInstructions(kase.sentences.getChildren(), switchEnv);
                    });
                    this.position = sts;
                    Singleton.insertEnviroment(switchEnv);
                    break;
            }
        }
    }

    processVarT15(env, ins, global) {
        let flag = false;
        let type = ins.type.name;
        let ids = ins.ids.getChildren();
        ids.forEach(id =>{
            let symbol = new Symbol(id.id, env.id === 'global' ? 'global var' : 'local var', type, this.position, env.id, id.row, id.column);
            let res = env.addSymbol(symbol);
            if (res === true) {
                this.position++;
                flag = true;
            }
            else {
                Singleton.insertError(new SharpError('Semantico',
                    'La variable "' + id.id +'" ya ha sido definida en el contexto actual', id.row, id.column));
            }
        });
        if (global && flag) {
            vars.push(ins);
        }
    }

    processVarT234(env, ins, opt, global) {
        let flag = false;
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

        if (role === 'global var' && env.id != 'global') {
            let global = Singleton.getEnviroment('global');
            symbol.envId = 'global';
            symbol.position = global.last;
            let res = global.addSymbol(symbol);
            if (res === true) {
                flag = true;
            }
            else {
                Singleton.insertError(new SharpError('Semantico',
                    'La variable "' + id.id + '" ya ha sido definida en el contexto actual', id.row, id.column));
            }
        }
        else {
            let res = env.addSymbol(symbol);
            if (res === true) {
                this.position++;
                flag = true;
            }
            else {
                Singleton.insertError(new SharpError('Semantico',
                    'La variable "' + id.id + '" ya ha sido definida en el contexto actual', id.row, id.column));
            }
        }
        

        if (global && flag) {
            vars.push(ins);
        }
    }

    processFunctions(functions) {
        let global = Singleton.getEnviroment('global');
        functions.forEach(proc => {
            let flag = true;
            this.position = 1;
            let id = proc.id;
            let type = proc.type;
            let parameters = proc.parameters.getChildren();
            let procEnv = global.generateProcEnviroment(id.id+'_'+parameters.length+'_'+id.row, type.name, parameters.length, id.row, id.column);
            // insert return at first position
            let ret = new Symbol('return', 'local var', proc.type.name, 0, id.id+'_'+parameters.length+'_'+id.row, 0, 0);
            procEnv.addSymbol(ret);
            parameters.forEach(param => {
                let sym = new Symbol(param.identifier.id, 'local var', param.type.name, this.position, procEnv.id);
                let r = procEnv.addSymbol(sym);
                if (r) {
                    this.position++;
                    sym.setActive();
                }
                else {
                    Singleton.insertError(new SharpError('Semantico',
                    'El parametro "' + param.identifier.id + '" ya ha sido definido', param.identifier.row, param.identifier.column));
                    flag = false;
                }
            });

            if (flag) {
                procEnv = Singleton.insertEnviroment(procEnv);
                if (procEnv != null) {
                    // Gotta process the instructions of every procedure
                    let sentences = proc.sentences.getChildren();
                    this.processInstructions(sentences, procEnv);

                    approvedFunctions.push(proc);
                }
            }
        });
    }

    processImports(ast) {
        let imports = ast.imports.slice(0);
        imports.forEach(file => {
            ast.global_vars.splice(0, ast.global_vars.length);
            ast.functions_list.splice(0, ast.functions_list.length);
            ast.global_strcs.splice(0, ast.global_strcs.length);
            ast.imports.splice(0, ast.imports.length);

            try {
                let fileRes = fs.readFileSync(`./Imports/${file.id}`);
                let bst = parser.parse(fileRes.toString());
                this.processFunctions(bst.functions_list);
            }
            catch (e) {
                Singleton.insertError(new SharpError('Semantico', `El archivo ${file.id} no existe`, file.row, file.column));
                console.log(e);
            }
        });
    }
}

module.exports.Process = Process;
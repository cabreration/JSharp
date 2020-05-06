const SharpError = require('./sharpError').SharpError;

class Singleton {

    static sharpErrors = [];
    static strcDefinitions = [];
    static symbolsTable = [];
    
    static insertError(error) {
        Singleton.sharpErrors.push(error);
    }

    static insertStrcDef(strc) {
        if (Singleton.strcDefinitions.length === 0) {
            Singleton.strcDefinitions.push(strc);
            return;
        }
        
        for (let i = 0; i < Singleton.strcDefinitions.length; i++) {
            if (Singleton.strcDefinitions[i].identifier.id === strc.identifier.id) {
                Singleton.sharpErrors.push(new SharpError('Semantico',
                    'Ya existe una estructura definada "' + strc.identifier.id + '"',
                    strc.identifier.row,
                    strc.identifier.column
                ));
                return;
            }
        }

        Singleton.strcDefinitions.push(strc);
    }

    static getStrc(id) {
        for (let i = 0; i < Singleton.strcDefinitions.length; i++) {
            if (Singleton.strcDefinitions[i].identifier.id === id) {
                return Singleton.strcDefinitions[i];
            }
        }
        return null;
    }

    static insertEnviroment(env) {
        if (Singleton.symbolsTable.length === 0) {
            Singleton.symbolsTable.push(env);
            return env;
        }
        else {
            if (env.functionFlag) {
                for (let i = 0; i < Singleton.symbolsTable.length; i++) {
                    if (Singleton.symbolsTable[i].id === env.id && Singleton.symbolsTable[i].paramsCount === env.paramsCount) {
                        // check the types of the parameters
                        let flag = true;
                        for (let j = 0; j < env.paramsCount; j++) {
                            if (Singleton.symbolsTable[i].symbols[j].type != env.symbols[j].type) {
                                flag = false;
                            }
                        }

                        if (flag) {
                            let error = new SharpError('Semantico', 'Ya existe una funcion denominada "'+ env.id +'" con el mismo numero de parametros y los mismos tipos', env.row, env.column);
                            Singleton.sharpErrors.push(error);
                            return null;
                        }
                    }
                }
            }
            Singleton.symbolsTable.push(env);
            return env;
        }
    }

    static getEnviroment(id) {
        for (let i = 0; i < Singleton.symbolsTable.length; i++) {
            if (Singleton.symbolsTable[i].id === id) {
                return Singleton.symbolsTable[i];
            }
        }
    }

    static getFunctions(id) {
        let ret = [];
        for (let i = 0; i < Singleton.symbolsTable.length; i++) {
            if (Singleton.symbolsTable[i].id.includes(id+'_') && Singleton.symbolsTable[i].functionFlag) {
                ret.push(Singleton.symbolsTable[i]);
            }
        }

        return ret;
    }

    static restart() {
        Singleton.sharpErrors = [];
        Singleton.strcDefinitions = [];
        Singleton.symbolsTable = [];
    }

    static validateType(type) {
        switch (type) {
            case 'int':
            case 'boolean':
            case 'double':
            case 'string':
            case 'char':
            case 'var':
            case 'const':
            case 'global':
            case 'string[]':
            case 'int[]':
            case 'double[]':
            case 'boolean[]':
            case 'char[]':
                return true;
        }

        // check if the structure exists
        for (let i = 0; i < Singleton.strcDefinitions.length; i++) {
            if (type === Singleton.strcDefinitions[i].identifier.id) {
                return true;
            }
        }

        return false;
    }
}

module.exports.Singleton = Singleton;
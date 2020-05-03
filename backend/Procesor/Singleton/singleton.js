const SharpError = require('./sharpError').SharpError;

class Singleton {

    static sharpErrors = [];
    static strcDefinitions = [];
    static symbolsTable = [];
    static heap = [];
    static stack = [];
    
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

    static insertEnviroment(env) {
        if (Singleton.symbolsTable.length === 0) {
            Singleton.symbolsTable.push(env);
            return env;
        }
        else {
            if (env.functionFlag) {
                for (let i = 0; i < Singleton.symbolsTable.length; i++) {
                    if (Singleton.symbolsTable[i].id === env.id && Singleton.symbolsTable[i].role === env.role
                        && Singleton.symbolsTable[i].paramsCount === env.paramsCount) {
                            let error = new SharpError('Semantico',
                                'Ya existe una funcion denominada "'+ env.id +'"', 
                                env.row, 
                                env.column);
                            Singleton.sharpErrors.push(error);
                            return null;
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

    static restart() {
        Singleton.sharpErrors = [];
        Singleton.strcDefinitions = [];
        Singleton.symbolsTable = [];
        Singleton.heap = [];
        Singleton.stack = [];
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
            if (type === Singleton.strcDefinitions[i].id) {
                return true;
            }
        }

        return false;
    }
}

module.exports.Singleton = Singleton;
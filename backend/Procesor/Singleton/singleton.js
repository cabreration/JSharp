const SharpError = require('./sharpError').SharpError;

class Singleton {

    static sharpErrors = null;
    static strcDefinitions = null;
    static symbolsTable = null;
    
    static inserError(error) {
        if (Singleton.sharpErrors == null) {
            Singleton.sharpErrors = [];
            Singleton.sharpErrors.push(error)
        }
        else {
            Singleton.sharpErrors.push(error);
        }
    }

    static insertStrcDef(strc) {
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
        if (Singleton.symbolsTable == null) {
            Singleton.symbolsTable = [ env ];
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
                    }
                }
            }
            Singleton.symbolsTable.push(env);
        }
    }

    static getEnviroment(id) {
        for (let i = 0; i < Singleton.symbolsTable; i++) {
            if (Singleton.symbolsTable[i].id === id) {
                return Singleton.symbolsTable[i];
            }
        }
    }
}

module.exports.Singleton = Singleton;
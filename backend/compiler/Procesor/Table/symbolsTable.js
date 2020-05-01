class SymbolsTable {

    constructor(enviroment) {
        this.enviroments = [ enviroment ];
    }

    insertEnviroment(enviroment) {
        if (enviroment.functionFlag) {
            // it is a function
            for (let i = 0; i < this.enviroments.length; i++) {
                if (this.enviroments[i].functionFlag) {
                    if (this.enviroments[i].id === enviroment.id 
                        && this.enviroments[i].role === enviroment.role 
                        && this.enviroments[i].paramsCount === enviroment.paramsCount) {
                            // the function already exists
                            return false;
                        }
                }
                this.enviroments.push(enviroment);
                return true;
            }
        }
        else {
            this.enviroments.push(enviroment);
            return true;
        }
    }

    searchEnviroment(id) {
        for(let i = 0; i < this.enviroments.length; i++) {
            if (this.enviroments[i].id === id) {
                return this.enviroments[i];
            }
        }

        // la funcion no existe
        return null;
    }
}

module.exports.SymbolsTable = SymbolsTable;
class Enviroment {
    constructor(id, role, parent, functionFlag, paramsCount) {
        this.id = id;
        this.role = role;
        this.parent = parent;
        this.functionFlag = functionFlag;
        this.paramsCount = paramsCount;
        this.last = 0;
        this.symbols = [];
    }

    generateSubEnviroment(id, role) {
        let nu = new Enviroment(id, role, this.id, false, 0);
        // pass all of the info
        this.symbols.forEach(symbol => {
            let shadow = symbol.shadow();
            nu.symbols.push(shadow);
        });
        return nu;
    }

    generateFuncEnviroment(id, role, paramsCount) {
        let nu = new Enviroment(id, role, this.id, true, paramsCount);
        // pass all of the vars
        this.symbols.forEach(symbol => {
            let shadow = symbol.shadow();
            nu.symbols.push(shadow);
        });
        return nu;
    }

    addSymbol(newSymbol) {
        let flag = false;
        this.symbols.forEach(symbol => {
            if (symbol.id === newSymbol.id && symbol.envId === newSymbol.envId) {
                flag = true;
            }
        });

        if (!flag) {
            this.symbols.push(newSymbol);
            this.last++;
            return true;
        }

        // la variable ya existe
        return false;
    }

    getSymbol(id) {
        let result = [];
        this.symbols.forEach(symbol => {
            if (symbol.id === id) {
                result.push(symbol);
            }
        });

        if (result.length === 0) {
            return null; //such variable doesnt exist
        }
        
        if (result.length === 1)
            return result[0];
        else if (result.length > 1) {
            // we look for the one that has the envId of the current enviroment
            for (let i = 0; i < result.length; i++) {
                if (result[i].envId === this.id) {
                    return result[i];
                }
            }
        }
    }
}

module.exports.Enviroment = Enviroment;
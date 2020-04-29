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
    }

    generateFuncEnviroment(id, role, paramsCount) {
        let nu = new Enviroment(id, role, this.id, true, paramsCount);
        // pass all of the vars
    }

    addSymbol(newSymbol) {
        let flag = false;
        this.symbols.forEach(symbol => {
            if (symbol.id === newSymbol.id) {
                flag = true;
            }
        });

        if (!flag) {
            this.symbols.push(newSymbol);
        }
    }

    getSymbol(id) {
        this.symbols.forEach(symbol => {
            if (symbol.id === id) {
                return symbol;
            }
        });

        return null;
    }
}

module.exports.Enviroment = Enviroment;
class Enviroment {

    constructor(id, role, parent, functionFlag, paramsCount, row, column) {
        this.id = id;
        this.role = role; // if it is a function we use role to store the function type
        this.parent = parent;
        this.functionFlag = functionFlag;
        this.paramsCount = paramsCount;
        this.row = row;
        this.column = column;
        this.last = 0;
        this.symbols = [];
    }

    generateSubEnviroment(id, role) {
        return new Enviroment(id, role, this.id, false, 0)
    }

    generateProcEnviroment(id, role, paramsCount, row, column) {
        return new Enviroment(id, role, this.id, true, paramsCount, row, column);
    }

    containsSymbol(id) {
        for (let i = 0; i < this.symbols.length; i++) {
            if (this.symbols[i].id === id) {
                return true;
            }
        }

        return false;
    }

    addSymbol(sym) {
        if (this.containsSymbol(sym.id)) {
            return false;
        }

        this.symbols.push(sym);
        this.last++;
        return true;
    }

    getSymbol(id) {
        for (let i = 0; i < this.symbols.length; i++) {
            if (this.symbols[i].id === id) {
                return { state: true, res :this.symbols[i] };
            }
        }

        return { state: false, res: this.parent };
    }

}

module.exports.Enviroment = Enviroment;
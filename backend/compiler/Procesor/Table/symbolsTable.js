class SymbolsTable {

    constructor(enviroment) {
        this.enviroments = [ enviroment ];
    }

    insertEnviroment(enviroment) {
        let flag = false;
        this.enviroments.forEach(env => {
            if (enviroment.id === env.id) {
                flag = true;
            }
        });

        if (!flag) {
            this.enviroments.push(enviroment);
        }
    }

    searchEnviroment(id) {
        for(let i = 0; i < this.enviroments.length; i++) {
            if (this.enviroments[i].id === id) {
                return this.enviroments[i];
            }
        }

        return null;
    }
}

module.exports.SymbolsTable = SymbolsTable;
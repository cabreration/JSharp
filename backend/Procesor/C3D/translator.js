let Singleton = require('../Singleton/singleton').Singleton;

class Translator {
    constructor() {
        this.temp = 1;
        this.label = 1;
        this.code = [];
    }

    update(updater) {
        this.temp = updater.temp;
        this.label = updater.label;
    }

    fillTemps() {
        let tempsCode = 'var ';
        for (let i = 1; i < this.temp - 1; i++) {
            tempsCode += `t${i}, `;
        }
        tempsCode += `t${this.temp};`;
        this.code.push(tempsCode);
    }

    translate(ast) {
        this.generateHeader();
        let glob = this.translateGlobalInstructions(ast.global_vars);
        if (this.temps > 1)
            this.fillTemps();
        this.code.push(glob);

        // TODO - call main
        this.code.push(`call principal;`)
        
        this.code.push('\n\n');
        let proc = this.translateProcedures(ast.functions_list);
        this.code.push(proc);
        return this.code.join('\n');
    }

    generateHeader() {
        this.code.push('var p, h;');
        this.code.push('p = 0;');
        this.code.push(`h = ${Singleton.symbolsTable[0].last};`);
        this.code.push('var heap[];');
        this.code.push('var stack[];')
    }

    translateGlobalInstructions(instructions) {
        let global = Singleton.getEnviroment('global');
        let globalCode =  [];
        for (let i = 0; i < instructions.length; i++) {
            let current = instructions[i];
            let updater = current.getTDC(global, this.label, this.temp, this.heapPtr, this.stackPtr);
            if (updater.code != null)
                globalCode.push(updater.code);
            this.update(updater);
        }

        if (globalCode.length > 0)
            return globalCode.join('\n');
        else 
            return null;
    }

    translateProcedures(procedures) {
        let globalCode = [];
        for (let i = 0; i < procedures.length; i++) {
            let current = procedures[i];
            let env = Singleton.getEnviroment(current.id.id+'-'+current.type.name+'-'+current.parameters.getChildren().length);
            let updater = current.getTDC(env, this.label, this.temp, this.heapPtr, this.stackPtr);
            if (updater.code != null)
                globalCode.push(updater.code);
            this.update(updater);
        }

        if (globalCode.length > 0)
            return globalCode.join('\n');
        else 
            return null;
    }
}

module.exports.Translator = Translator;
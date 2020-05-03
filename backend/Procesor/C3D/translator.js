let Singleton = require('../Singleton/singleton').Singleton;

class Translator {
    constructor() {
        this.temp = 1;
        this.label = 1;
        this.code = [];
        this.heapPtr = Singleton.symbolsTable[0].last;
        this.stackPtr = 0;
    }

    update(updater) {
        this.temp = updater.temp;
        this.label = updater.label;
        this.heapPtr = updater.heapPtr;
        this.stackPtr = updater.heapPtr;
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
        return this.code.join('\n');
    }

    generateHeader() {
        this.code.push('var p, h;');
        this.code.push('p = 0;');
        this.code.push(`h = ${this.heapPtr};`);
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
        }

        if (globalCode.length > 0)
            return globalCode.join('\n');
        else 
            return null;
    }
}

module.exports.Translator = Translator;
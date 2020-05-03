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

    translate(ast) {
        this.generateHeader();
        this.translateGlobalInstructions(ast.global_vars);
    }

    generateHeader() {
        this.code.push('var p, h;');
        this.code.push('p = 0;');
        this.code.push(`h = ${this.heapPtr};`);
        this.code.push('var heap[];');
        this.code.push('var stack[];')
    }

    translateGlobalInstructions(instructions) {.
        let global = Singleton.getEnviroment('global');
        for (let i = 0; i < instructions.length; i++) {
            let current = instructions[i];
            let updater = current.getTDC(global, this.label, this.temp);
            if (updater.code != null)
                this.code.push(updater.code);
        }
    }
}

module.exports.Translator = Translator;
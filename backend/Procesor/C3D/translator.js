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
        let counter = 1;
        while (counter < this.temp) {
            tempsCode += `t${counter}, `;
            counter++;
        }
        tempsCode += `t${this.temp};`;
        this.code.push(tempsCode);
    }

    translate(ast) {
        // create the header
        let head = this.generateHeader();

        // translate the global instructions
        let glob = this.translateGlobalInstructions(ast.global_vars);
        
        // translate the functions
        let proc = this.translateProcedures(ast.functions_list);

        // add the temporals
        this.fillTemps();

        // add the header
        this.code.push(head);

        // add the generated 3DC for the global instructions
        this.code.push(glob);

        // call main
        this.code.push(`call principal_void_0;`)
        this.code.push(`goto L${this.label};\n`);

        // add the generated 3DC for the functions
        this.code.push(proc);

        // end
        this.code.push(`L${this.label}:\n`);
        this.label++;

        // return all of the code
        return this.code.join('\n');
    }

    generateHeader() {
        let header = [];
        header.push('var p, h;');
        header.push('p = 0;');
        header.push(`h = ${Singleton.symbolsTable[0].last};`);
        header.push('var heap[];');
        header.push('var stack[];');
        return header.join('\n');
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
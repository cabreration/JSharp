const Singleton = require('../../Procesor/Singleton/singleton').Singleton;
const Updater = require('../Utilities/updater').Updater;

class Function {
    constructor(type, id, parameters, sentences) {
        this.type = type; // Type
        this.id = id; // Identifier
        this.parameters = parameters; // NodeList - Parameter 
        this.sentences = sentences; // NodeList - Sentence(if, while, for, etc);
    }

    getDot() {
        return '[label="FUNCTION"];\n';
    }

    getChildren() {
        return [ this.type, this.id, this.parameters, this.sentences ];
    }

    getTypeOf() {
        return 'function';
    }

    getTDC(env, label, temp) {
        let code = [];
        code.push(`proc ${this.id.id}_${this.type.name}_${this.parameters.getChildren.length} begin`);
        
        // translate all of the instructions
        let instructions = this.sentences.getChildren();
        for (let i = 0; i < instructions.length; i++) {
            let ins = instructions[i];
            let updater = ins.getTDC(env, label, temp);
            label = updater.label;
            temp = updater.temp;
            if (updater.code != null)
                code.push(updater.code);
        }

        code.push('end\n');
        return new Updater(env, label, temp, code.join('\n\n'));
    }
}

module.exports.Function = Function;
const Singleton = require('../../Procesor/Singleton/singleton').Singleton;
const SharpError = require('../../Procesor/Singleton/sharpError').SharpError;
const Updater = require('../Utilities/updater').Updater;

class WhileSentence {
    constructor(condition, sentences, row, column) {
        this.condition = condition; // nodelist -> [ condition ]
        this.sentences = sentences; // nodelist -> [ sentences ]
        this.row = row; // number
        this.column = column; // number
        this.inEnv = -1;
    }

    getDot() {
        return '[label="WHILE SENTENCE"];\n';
    }

    getChildren() {
        return [ this.condition, this.sentences ]
    }

    getTypeOf() {
        return 'whilesentence';
    }

    getTDC(env, label, temp) {
        // check the expression type
        let exp = this.condition.getChildren()[0];
        let validate = exp.checkType(env);
        if (typeof(validate) === 'object') {
            Singleton.insertError(validate);
            return new Updater(env, label, temp, null);
        }

        if (validate != 'boolean') {
            Singleton.insertError(new SharpError('Semantico', `La condicion dada para el bloque while no es de tipo booleano`, this.row, this.column));
            return new Updater(env, label, temp, null);
        }

        let code = [];
        let label1 = `L${label}`;
        label++;

        code.push(`${label1}:`);
        // get the expression value
        let expVal = exp.getTDC(env, label, temp);
        if (expVal.value == null) {
            return expVal;
        }
        if (expVal.code != null) {
            code.push(expVal.code);
        }
        label = expVal.label;
        temp = expVal.temp;
        let val = expVal.value;
        let instructions = this.sentences.getChildren();

        // finally translate
        let temp1 = `t${temp}`;
        temp++;
        let label2 = `L${label}`;
        label++;

        code.push(`${temp1} = ${val};`);
        code.push(`if (${temp1} == 0) goto ${label2};`);

        // start the break and continue flag
        let loopFlag = true;
        if (!Singleton.oneWords.loop) {
            loopFlag = false;
            Singleton.oneWords.loop = true;
        }

        let whileEnv = Singleton.getEnviroment(env.id+this.inEnv+'-while')
        let moves = env.last;

        code.push(`p = p + ${moves};`);
        instructions.forEach(ins => {
            let tdc = ins.getTDC(whileEnv, label, temp);
            if (tdc.code != null) {
                tdc.code = tdc.code.replace(/!!!!/g, `p = p - ${moves};\ngoto ${label2};`);
                tdc.code = tdc.code.replace(/{{{{/g, `p = p - ${moves};\ngoto ${label1};`);
                code.push(tdc.code);
                temp = tdc.temp;
                label = tdc.label;
            }
        });
        code.push(`p = p - ${moves};`);

        code.push(`goto ${label1};`);
        code.push(`${label2}:`);

        // finish break and continue flag
        if (!loopFlag) {
            Singleton.oneWords.loop = false;
        }

        return new Updater(env, label, temp, code.join('\n'));
    }
}

module.exports.WhileSentence = WhileSentence;
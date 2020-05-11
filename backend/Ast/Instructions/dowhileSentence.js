const Singleton = require('../../Procesor/Singleton/singleton').Singleton;
const SharpError = require('../../Procesor/Singleton/singleton').Singleton;
const Updater = require('../Utilities/updater').Updater;

class DowhileSentence {
    constructor(sentences, condition, row, column) {
        this.condition = condition; // nodelist -> [ condition ]
        this.sentences = sentences; // nodelist -> [ instructions ]
        this.row = row; // number
        this.column = column; // number
        this.inEnv = -1;
    }

    getDot() {
        return '[label="DO-WHILE SENTENCE"];\n';
    }

    getChildren() {
        return [ this.sentences, this.condition ]
    }

    getTypeOf() {
        return 'dowhilesentence';
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
        let label2 = `L${label}`;
        label++;
        code.push(`${label1}:`);

        // start the break and continue flag
        let loopFlag = true;
        if (!Singleton.oneWords.loop) {
            loopFlag = false;
            Singleton.oneWords.loop = true;
        }

        let instructions = this.sentences.getChildren();
        let dowhileEnv = Singleton.getEnviroment(env.id+this.inEnv+'-dowhile');
        let moves = env.last;

        code.push(`p = p + ${moves};`)
        instructions.forEach(ins => {
            let tdc = ins.getTDC(dowhileEnv, label, temp);
            if (tdc.code != null) {
                tdc.code = tdc.code.replace(/!!!!/g, `p = p - ${moves};\ngoto ${label2};`); // should change this, p = p - moves
                tdc.code = tdc.code.replace(/{{{{/g, `p = p - ${moves};\ngoto${label1};`); // p = p - moves
                code.push(tdc.code);
                temp = tdc.temp;
                label = tdc.label;
            }
        });
        code.push(`p = p - ${moves};`)

        // finish break and continue flag
        if (!loopFlag) {
            Singleton.oneWords.loop = false;
        }

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

        let temp1 = `t${temp}`;
        temp++;
        code.push(`${temp1} = ${val};`);
        code.push(`if (${temp1} == 1) goto ${label1};`);
        code.push(`${label2}:`);

        return new Updater(env, label, temp, code.join('\n'));
    }
}

module.exports.DowhileSentence = DowhileSentence;
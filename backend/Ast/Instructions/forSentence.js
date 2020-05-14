const Singleton = require('../../Procesor/Singleton/singleton').Singleton;
const SharpError = require('../../Procesor/Singleton/sharpError').SharpError;
const Updater = require('../Utilities/updater').Updater;

class ForSentence {

    constructor(start, middle, end, sentences, row, column) {
        this.start = start;  // nodelist -> []
        this.middle = middle; // nodeList -> []
        this.end = end; // nodelist -> []
        this.sentences = sentences; // nodelist => [ sentences ]
        this.row = row; // number
        this.column = column; // number
        this.inEnv = -1;
    }

    getDot() {
       return '[label="FOR SENTENCE"];\n';
    }

    getChildren() {
        return [ this.start, this.middle, this.end, this.sentences ]
    }

    getTypeOf() {
        return 'forsentence';
    }

    getTDC(env, label, temp) {
        let originalLabel = label;
        let originalTemp = temp;
        let code = [];

        let forEnv = Singleton.getEnviroment(env.id+this.inEnv+"-for");
        let moves = env.last;
        // validating for start
        code.push(`p = p + ${moves};`);
        if (this.start.getChildren().length > 0) {
            let init = this.start.getChildren()[0];

            let startTDC = init.getTDC(forEnv, label, temp);
            if (startTDC.code != null) {
                label = startTDC.label;
                temp = startTDC.temp;
                code.push(startTDC.code);
            }
            else {
                return new Updater(env, originalLabel, originalTemp, null);
            }
        }

        let middleLabel = `L${label}`;
        label++;
        code.push(`${middleLabel}:`);
        let endLabel = `L${label}`;
        label++;
        let continueLabel = `L${label}`;
        label++;
        // validating condition
        if (this.middle.getChildren().length > 0) {
            // check that the condition returns a boolean
            let exp = this.middle.getChildren()[0];
            let validate = exp.checkType(forEnv);
            if (typeof(validate) === 'object') {
                Singleton.insertError(validate);
                return new Updater(env, originalLabel, originalTemp, null);
            }

            if (validate != 'boolean') {
                Singleton.insertError(new SharpError('Semantico', `La expresion proporcionada para el bloque for no resulta en un valor booleano`, this.row, this.column));
                return new Updater(env, originalLabel, orginalTemp, null);
            }

            // get the expression value
            let expVal = exp.getTDC(forEnv, label, temp);
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
            code.push(`if (${temp1} == 0) goto ${endLabel};`);
        }

        let loopFlag = true;
        if (!Singleton.oneWords.loop) {
            loopFlag = false;
            Singleton.oneWords.loop = true;
        }

        let instructions = this.sentences.getChildren();
        instructions.forEach(ins => {
            let tdc = ins.getTDC(forEnv, label, temp);
            if (tdc.code != null) {
                tdc.code = tdc.code.replace(/!!!!/g, `goto ${endLabel};`);
                tdc.code = tdc.code.replace(/{{{{/g, `goto ${continueLabel};`);
                tdc.code = tdc.code.replace(/@@@@/g, `p = p - ${moves};\n@@@@`);
                code.push(tdc.code);
                temp = tdc.temp;
                label = tdc.label;
            }
        });
        code.push(`${continueLabel}:`)
        if (this.end.getChildren().length > 0) {
            let tdc = this.end.getChildren()[0].getTDC(forEnv, label, temp);
            if (tdc.code != null) {
                code.push(tdc.code);
                temp = tdc.temp;
                label = tdc.label;
            }
        }
        code.push(`goto ${middleLabel};`);
        code.push(`${endLabel}:`);
        code.push(`p = p - ${moves};`);

        // finish break and continue flag
        if (!loopFlag) {
            Singleton.oneWords.loop = false;
        }

        return new Updater(env, label, temp, code.join('\n'));
    }
}

module.exports.ForSentence = ForSentence;
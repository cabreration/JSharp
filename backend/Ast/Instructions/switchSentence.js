const Singleton = require('../../Procesor/Singleton/singleton').Singleton;
const SharpError = require('../../Procesor/Singleton/sharpError').SharpError;
const Updater = require('../Utilities/updater').Updater;

class SwitchSentence {
    constructor(condition, cases, row, column) {
        this.condition = condition; // nodelist -> [ expression ]
        this.cases = cases; // [ cases ] -> nodelist 
        this.row = row; // number
        this.column = column; // number
        this.inEnv = - 1;
    }

    getDot() {
        return '[label="SWITCH SENTENCE"];\n';
    }

    getChildren() {
        return [ this.condition, this.cases ]
    }

    getTypeOf() {
        return 'switchsentence';
    }

    getTDC(env, label, temp) {
        let code = [];

        let exp = this.condition.getChildren()[0];
        let validate = exp.checkType(env);
        if (typeof(validate) === 'object') {
            Singleton.insertError(validate);
            return new Updater(env, label, temp, null);
        }

        if (validate != 'boolean' && validate != 'int' 
        && validate != 'double' && validate != 'char' && validate != 'string') {
            Singleton.insertError(new SharpError('Semantico', `La condicion dada para el bloque if no es de tipo booleano`, this.row, this.column));
            return new Updater(env, label, temp, null);
        }

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

        let kases = this.cases.getChildren();

        let scapeLabel = `L${label}`;
        label++;

        let temp1 = `t${temp}`;
        temp++;

        let previouslyFlag = true;
        if (!Singleton.oneWords.choose) {
            previouslyFlag = false;
            Singleton.oneWords.choose = true;
        }

        code.push(`${temp1} = ${val};`);
        let switchEnv = Singleton.getEnviroment(env.id+this.inEnv+'-switch');
        let moves = env.last;

        code.push(`p = p + ${moves};`);
        for (let i = 0; i < kases.length; i++) {
            let k = kases[i];
            let ktdc = k.getTDC(switchEnv, label, temp, validate, temp1);
            if (ktdc.code != null) {
                if (i === kases.length - 1) {
                    if (kases[i].value == null) {
                        code[code.length - 1] = code[code.length - 1].replace(/X@/, scapeLabel);
                    }
                    else {
                        code[code.length - 1] = code[code.length - 1].replace(/X@/, k.exec);
                    }
                }
                else {
                    code[code.length - 1] = code[code.length - 1].replace(/X@/, k.exec);
                }
                //ktdc.code = ktdc.code.replace(/X@/, k.exec);
                ktdc.code = ktdc.code.replace(/!!!!/g, `goto ${scapeLabel};`);
                ktdc.code = ktdc.code.replace(/{{{{/g, `p = p - ${moves};\n{{{{;`);
                ktdc.code = ktdc.code.replace(/@@@@/g, `p = p - ${moves};\n@@@@`);
                code.push(ktdc.code);
                temp = ktdc.temp;
                label = ktdc.label;
            }
        }
        code[code.length - 1] = code[code.length - 1].replace(/X@;/, scapeLabel);
        code.push(`${scapeLabel}:`);
        code.push(`p = p - ${moves};`);

        if (!previouslyFlag) {
            Singleton.oneWords.choose = false;
        }
        return new Updater(env, label, temp, code.join('\n'));
    }
}

module.exports.SwitchSentence = SwitchSentence;
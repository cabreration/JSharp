const Singleton = require('../../Procesor/Singleton/singleton').Singleton;
const SharpError = require('../../Procesor/Singleton/singleton').Singleton;
const Updater = require('../Utilities/updater').Updater;

class IfSentence {
    constructor(condition, sentences, elseSentence, row, column) {
        this.condition = condition; // nodelist -> [ expression ]
        this.sentences = sentences; // [ instruction ] -> nodelist
        this.elseSentence = elseSentence; // IfSentence     
        this.row = row; // number
        this.column = column; // number
        this.unique = 0;
        this.inEnv = -1;
    }

    getDot() {
        if (this.elseSentence == null && this.condition == null)
            return '[label="ELSE SENTENCE"];\n';
        else
            return '[label="IF SENTENCE"];\n';
    }

    getChildren() {
        if (this.elseSentence == null && this.condition == null) // else
            return [ this.sentences ]
        else if (this.elseSentence == null && this.condition != null) //if wo else
            return [ this.condition, this.sentences ];
        else 
            return [ this.condition, this.sentences, this.elseSentence ];
    }

    getTypeOf() {
        if (this.elseSentence == null && this.condition == null)
            return 'elsesentence';
        else
            return 'ifsentence';
    }

    getTDC(env, label, temp) {
        let code = [];

        let scapeLabel = `L${label}`;
        label++;
        if (this.condition != null) {
            // check the expression type
            let exp = this.condition.getChildren()[0];
            let validate = exp.checkType(env);
            if (typeof(validate) === 'object') {
                Singleton.insertError(validate);
                return new Updater(env, label, temp, null);
            }

            if (validate != 'boolean') {
                Singleton.insertError(new SharpError('Semantico', `La condicion dada para el bloque if no es de tipo booleano`, this.row, this.column));
                return new Updater(env, label, temp, null);
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
            let instructions = this.sentences.getChildren();

            // finally translate;
            let temp1 = `t${temp}`;
            temp++;
            let label1 = `L${label}`;
            label++;

            code.push(`${temp1} = ${val};`);
            code.push(`if (${temp1} == 0) goto ${label1};`);

            // Get the if env
            let ifEnv = Singleton.getEnviroment(env.id+this.inEnv+"-if");
            let moves = env.last;

            code.push(`p = p + ${moves};`);
            instructions.forEach(ins => {
                let td = ins.getTDC(ifEnv, label, temp);
                if (td.code != null) {
                    temp = td.temp;
                    label = td.label;
                    code.push(td.code);
                }
            });
            code.push(`p = p - ${moves};`);

            code.push(`goto ${scapeLabel};`); // goto to la salida
            code.push(`${label1}:`);
        }
        else {
            let instructions = this.sentences.getChildren();

            // Get the if env
            let elseEnv = Singleton.getEnviroment(env.id+this.inEnv+"-else"+this.unique);
            let moves = env.last;

            code.push(`p = p + ${moves};`)
            instructions.forEach(ins => {
                let td = ins.getTDC(elseEnv, label, temp);
                if (td.code != null) {
                    td.code = td.code.replace(/!!!!/, `p = p - ${moves};\n!!!!`);
                    td.code = td.code.replace(/{{{{/, `p = p - ${moves};\n{{{{`);
                    temp = td.temp;
                    label = td.label;
                    code.push(td.code);
                }
            });
            code.push(`p = p - ${moves};`);
        }

        if (this.elseSentence != null) {
            this.elseSentence.unique = this.unique + 1;
            let elseTDC = this.elseSentence.getTDC(env, label, temp);
            if (elseTDC.code != null) {
                code.push(elseTDC.code);
                temp = elseTDC.temp;
                label = elseTDC.label;
            }
        }
        code.push(`${scapeLabel}:`);

        return new Updater(env, label, temp, code.join('\n'));
    }
}

module.exports.IfSentence = IfSentence;
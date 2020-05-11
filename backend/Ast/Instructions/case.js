const Singleton = require('../../Procesor/Singleton/singleton').Singleton;
const SharpError = require('../../Procesor/Singleton/sharpError').SharpError;
const Updater = require('../Utilities/updater').Updater;

class Case {
    constructor(value, sentences, row, column) {
        this.value = value; // nodelist -> [ expression ]
        this.sentences = sentences; // [ sentences ] -> nodelist 
        this.row = row; // number
        this.column = column; // number
        this.exec = null;
    }

    getDot() {
        if (this.value != null)
            return '[label="CASE"];\n';
        else
            return '[label="DEFAULT"];\n';
    }

    getChildren() {
        if (this.value == null)
            return [ this.sentences ];
        else 
            return [ this.value, this.sentences ]
    }

    getTypeOf() {
        if (this.value != null)
            return 'case';
        else 
            return 'default';
    }

    getTDC(env, label, temp, type, value) {
        // we get current case type and compare it to the received
        let code = [];
        let nextLabel = `L${label}`;
        label++;

        if (this.value != null) {
            let ktype = this.value.getChildren()[0].checkType(env);
            if (typeof(ktype) === 'object') {
                Singleton.insertError(ktype);
                return new Updater(env, label, temp, null);
            }

            if (ktype != type) {
                let flag = true;
                if (type == 'double') {
                    if (ktype == 'int' || ktype == 'char') {
                        flag = false;
                    }
                }
                else if (type === 'int') {
                    if (ktype === 'char') {
                        flag = false;
                    }
                }
                
                if (flag) {
                    let error = new SharpError('Semantico', 'El tipo de valor del case no concuerda con el tipo del switch', this.row, this.column);
                    Singleton.insertError(error);
                    return new Updater(env, label, temp, null);
                }
            }


            let expVal = this.value.getChildren()[0].getTDC(env, label, temp);
            if (expVal.value == null) {
                return new Updater(env, label, temp, null);
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
            if (ktype === 'string') {
                // compare the strings
                let es = this.generateEString3DC(value, temp1, label, temp);
                temp = es.temp;
                label = es.label;
                code.push(es.code);
                code.push(`if (${es.val} == 0) goto ${nextLabel};`);
            }
            else {
                // compare the values
                code.push(`if (${temp1} <> ${value}) goto ${nextLabel};`)
            }
        }

        // translate each instruction
        let execLabel = `L${label}`;
        label++;
        this.exec = execLabel;
        code.push(`${execLabel}:`);
        let instructions = this.sentences.getChildren();
        for (let i = 0; i < instructions.length; i++) {
            let ins = instructions[i];
            let td = ins.getTDC(env, label, temp);
            if (td.code != null) {
                temp = td.temp;
                label = td.label;
                code.push(td.code);
            }
        }
        if (this.value != null) {
            code.push(`goto X@;`);
        }
        code.push(`${nextLabel}:`);

        return new Updater(env, label, temp, code.join('\n'));
    }

    generateEString3DC(val1, val2, label, temp) {
        let code = [];
        let temp1 = `t${temp}`;
        temp++;
        let temp2 = `t${temp}`;
        temp++;
        let temp3 = `t${temp}`;
        temp++;
        let temp4 = `t${temp}`;
        temp++;
        let temp5 = `t${temp}`;
        temp++;
        let label1 = `L${label}`;
        label++;
        let label2 = `L${label}`;
        label++;
        let label3 = `L${label}`;
        label++;
        let label4 = `L${label}`;
        label++;

        code.push(`${temp1} = ${val1};`);
        code.push(`${temp2} = ${val2};`);
        code.push(`${label1}:`);
        code.push(`${temp3} = heap[${temp1}];`);
        code.push(`${temp4} = heap[${temp2}];`);
        code.push(`if (${temp3} <> ${temp4}) goto ${label2};`);
        code.push(`if (${temp3} == 0) goto ${label3};`);
        code.push(`${temp1} = ${temp1} + 1;`);
        code.push(`${temp2} = ${temp2} + 1;`);
        code.push(`goto ${label1};`);
        code.push(`${label2}:`);
        code.push(`${temp5} = 0;`);
        code.push(`goto ${label4};`);
        code.push(`${label3}:`);
        code.push(`${temp5} = 1;`);
        code.push(`${label4}:`);

        return {
            code: code.join('\n'),
            temp: temp,
            label: label,
            val: temp5
        }
    }
}

module.exports.Case = Case;
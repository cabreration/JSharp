const Singleton = require('../../Procesor/Singleton/singleton').Singleton;
const SharpError = require('../../Procesor/Singleton/sharpError').SharpError;
const Updater = require('../Utilities/updater').Updater;

class Identifier {
    constructor(id, row, column) {
        this.id = id; // String
        this.row = row; // Number
        this.column = column; // Number
        this.byValue = false;
    }

    byValue() {
        this.byValue = true;
    }

    getChildren() {
        return [];
    }

    getDot() {
        return '[label="' + this.id + '"];\n';
    }

    getTypeOf() {
        return 'identifier';
    }

    checkType(envId) {
        let thenv= envId.id;
        while (thenv != null) {
            let enviroment = Singleton.getEnviroment(thenv);
            let res = enviroment.getSymbol(this.id);
            if (res.state) {
                if (!res.lead.active) {
                    return new SharpError('Semantico', 'La variable "' + this.id + '" no existe en el contexto actual', this.row, this.column);
                }
                return res.lead.type;
            }
            else {
                thenv = res.lead;
                if (thenv == null) {
                    return new SharpError('Semantico', 'La variable "' + this.id + '" no existe en el contexto actual', this.row, this.column);
                }
            }
        }
    }

    getTDC(env, label, temp) {
        let code = [];
        // get the position and type from the enviroment
        let envId = env.id;
        let symbol;
        let counter = 0;
        let spaces = 0;
        do {
            let currentEnv = Singleton.getEnviroment(envId);
            symbol = currentEnv.getSymbol(this.id);
            envId = symbol.lead;
            counter++;
            if (counter > 1)
                spaces += currentEnv.last;
        }
        while (!symbol.state)

        // get the value and type
        let type = symbol.lead.type;
        let role = symbol.lead.role;
        let position = symbol.lead.position;
        let val;
        if (role === 'global var') {
            code.push(`t${temp} = heap[${position}];`);
            val = `t${temp}`;
            temp++;
        }
        else {
            if (counter > 1) {
                code.push(`t${temp} = p - ${spaces};`);
                temp++;
                code.push(`t${temp} = t${temp - 1} + ${position};`);
                temp++;
                code.push(`t${temp} = stack[t${temp - 1}];`);
                val = `t${temp}`;
                temp++;
            }
            else {
                code.push(`t${temp} = p + ${position};`);
                temp++;
                code.push(`t${temp} = stack[t${temp-1}];`);
                val = `t${temp}`;
                temp++;
            }
        }

        if (this.byValue) {
            let flag = true;
            switch(type) {
                case 'string':
                case 'int':
                case 'double':
                case 'boolean':
                case 'char':
                    flag = false;
                    break;
            }

            if (flag) {
                if (type.includes('[]')) {
                    // copiamos un arreglo, este es facil de copiar
                    let temp0 = `t${temp}`;
                    temp++;
                    let temp1 = `t${temp}`;
                    temp++;
                    let temp2 = `t${temp}`;
                    temp++;
                    let temp3 = `t${temp}`;
                    temp++;
                    let temp4 = `t${temp}`;
                    temp++;
                    let label1 = `L${label}`;
                    label++;
                    let label2 = `L${label}`;
                    label++;

                    code.push(`${temp0} = h;`)
                    code.push(`${temp1} = heap[${val}];`);
                    code.push(`heap[h] = ${temp1};`);
                    code.push(`h = h + 1;`);
                    code.push(`${temp2} = 0;`)
                    code.push(`${temp3} = ${val} + 1;`)
                    code.push(`${label1}:`)
                    code.push(`${temp4} = heap[${temp3}];`)
                    code.push(`if (${temp2} == ${temp1}) goto ${label2};`);
                    code.push(`heap[h] = ${temp4};`);
                    code.push(`h = h + 1;`);
                    code.push(`${temp3} = ${temp3} + 1;`)
                    code.push(`${temp2} = ${temp2} + 1;`);
                    code.push(`goto ${label1};`);
                    code.push(`${label2}:`)
                    val = temp0;
                }
                else {
                    // copiamos un objeto, para poder copiar el objeto hay que buscar su tipo y copiar sus atributos
                    // uno por uno
                    let strc = Singleton.getStrc(type);
                    let attsCount = strc.attributes.getChildren().length;
                    let temp0 = `t${temp}`;
                    temp++;
                    let temp1 = `t${temp}`;
                    temp++;
                    let temp2 = `t${temp}`;
                    temp++;
                    let temp3 = `t${temp}`;
                    temp++;
                    let temp4 = `t${temp}`;
                    temp++;
                    let label1 = `L${label}`;
                    label++;
                    let label2 = `L${label}`;
                    label++;

                    code.push(`${temp0} = h;`)
                    code.push(`${temp1} = 0;`);
                    code.push(`${temp2} = ${val};`)
                    code.push(`${label1}:`)
                    code.push(`${temp3} = heap[${temp2}];`)
                    code.push(`if (${temp1} == ${attsCount}) goto ${label2};`);
                    code.push(`heap[h] = ${temp3};`);
                    code.push(`h = h + 1;`);
                    code.push(`${temp2} = ${temp2} + 1;`)
                    code.push(`${temp1} = ${temp1} + 1;`);
                    code.push(`goto ${label1};`);
                    code.push(`${label2}:`)
                    val = temp0;
                }
            }
        }

        let updater = new Updater(env, label, temp, code.join('\n'));
        updater.addValue(val);
        updater.addType(type);
        return updater;
    }

}

module.exports.Identifier = Identifier;
const Singleton = require('../../Procesor/Singleton/singleton').Singleton;
const Updater = require('../Utilities/updater').Updater;

class PrintSentence {
    constructor(value, row, column) {
        this.value = value; // expression
        this.row = row; // number
        this.column = column; // number
    }

    getDot() {
        return '[label="PRINT"];\n';
    }

    getChildren() {
        return [ this.value ]
    }

    getTypeOf() {
        return 'printsentence';
    }

    getTDC(env, label, temp) {
        let code = [];
        // Validate expression
        let type = this.value.checkType(env);
        if (typeof(type) === 'object') {
            Singleton.insertError(type);
            return new Updater(env, label, temp, null);
        }

        // Translate the expression
        let updater = this.value.getTDC(env, label, temp);
        label = updater.label;
        temp = updater.temp;
        code.push(updater.code);

        // write code according to expression type
        if (updater.type == null) {
            console.error('YOU LEFT AN EXPRESSION WITH OUT RETURNING TYPE');
        }
        switch(updater.type) {
            case 'null':
                let nstr = this.printNull();
                code.push(nstr);
                break;
            case 'string':
                let str = this.printString(updater.value, label, temp);
                code.push(str.code);
                label = str.label;
                temp = str.temp;
                break;
            case 'int':
                code.push(this.printInt(updater.value));
                break;
            case 'double':
                code.push(this.printDouble(updater.value));
                break;
            case 'char':
                code.push(this.printChar(updater.value));
                break;
            case 'boolean':
                let bool = this.printBoolean(updater.value, label);
                code.push(bool.code);
                label = bool.label;
                break;
            case 'int[]':
                let ir = this.printArray(updater.value, temp, label, 'int');
                label = ir.label;
                temp = ir.temp;
                code.push(ir.code);
                break;
            case 'double[]':
                let dr = this.printArray(updater.value, temp, label, 'double');
                label = dr.label;
                temp = dr.temp;
                code.push(dr.code);
                break;
            case 'char[]':
                let cr = this.printArray(updater.value, temp, label, 'char');
                label = cr.label;
                temp = cr.temp;
                code.push(cr.code);
                break;
            case 'boolean[]':
                let br = this.printArray(updater.value, temp, label, 'boolean');
                label = br.label;
                temp = br.temp;
                code.push(br.code);
                break;
            case 'string[]':
                let sr = this.printArray(updater.value, temp, label, 'string');
                label = sr.label;
                temp = sr.temp;
                code.push(sr.code);
                break;
            default:
                if (updater.type.includes('[]')) {
                    // strc[]
                }
                else {
                    let objTDC = this.printObj(updater.value, updater.type, label, temp);
                    label = objTDC.label;
                    temp = objTDC.temp;
                    code.push(objTDC.code);
                }
                break;
        }
        return new Updater(env, label, temp, code.join('\n'));
    }


    printNull() {
        let code = [];
        code.push('print("%c", 110);');
        code.push('print("%c", 117);');
        code.push('print("%c", 108);');
        code.push('print("%c", 108);');
        return code.join('\n')
    }

    printInt(value) {
        return `print("%i", ${value});`;
    }

    printDouble(value) {
        return `print("%d", ${value});`;
    }

    printChar(value) {
        let code = [];
        //code.push('print("%c", 39);');
        code.push(`print("%c", ${value});`);
        //code.push('print("%c", 39);');
        return code.join('\n');
    }

    printBoolean(value, label) {
        let code = [];
        code.push(`if (${value} == 1) goto L${label};`);
        code.push(`print("%c", 102);`);
        code.push(`print("%c", 97);`);
        code.push('print("%c", 108);');
        code.push('print("%c", 115);');
        code.push('print("%c", 101);');
        code.push(`goto L${label + 1};`);
        code.push(`L${label}:`);
        label++;
        code.push('print("%c", 116);');
        code.push('print("%c", 114);');
        code.push('print("%c", 117);');
        code.push('print("%c", 101);');
        code.push(`L${label}:`);
        label++;
        return {
            code: code.join('\n'),
            label: label
        }
    }

    printString(value, label, temp) {
        let code = [];
        code.push(`t${temp} = ${value};`);
        temp++;
        code.push(`if (t${temp-1} > 0) goto L${label};`);
        code.push(`print("%c", 110);`);
        code.push(`print("%c", 117);`);
        code.push(`print("%c", 108);`);
        code.push(`print("%c", 108);`);
        code.push(`goto L${label+1};`)
        code.push(`L${label}:`);
        label++;
        code.push(`t${temp} = heap[t${temp - 1}];`);
        code.push(`if (t${temp} == 0) goto L${label};`);
        code.push(`print("%c", t${temp});`);
        code.push(`t${temp - 1} = t${temp - 1} + 1;`);
        code.push(`goto L${label-1};`);
        code.push(`L${label}:`);
        label++;
        temp++;
        let joined = code.join('\n')
        return {
            code: joined,
            label: label,
            temp: temp            
        }
    }

    printObj(value, type, label, temp) {
        let code = [];
        let strc = Singleton.getStrc(type);
        let attributes = strc.attributes.getChildren();

        let temp1 = `t${temp}`;
        temp++;
        let temp2 = `t${temp}`;
        temp++;
        let label1 = `L${label}`;
        label++;
        let label2 = `L${label}`;
        label++;

        code.push(`${temp1} = ${value};`);
        code.push(`if (${temp1} > 0) goto ${label1};`)
        code.push(`print("%c", 110);`);
        code.push(`print("%c", 117);`);
        code.push(`print("%c", 108);`);
        code.push(`print("%c", 108);`);
        code.push(`goto ${label2};`);
        code.push(`${label1}:`);
        code.push('print("%c", 123);');
        code.push('print("%c", 32);');
        for (let i = 0; i < attributes.length; i++) {
            code.push(`${temp2} = heap[${temp1}];`);
            let att = attributes[i];

            // printing the attribute name
            for (let j = 0; j < att.identifier.id.length; j++) {
                code.push(`print("%c", ${att.identifier.id.charCodeAt(j)});`);
            }
            code.push(`print("%c", 58);`);
            code.push(`print("%c", 32);`);

            // printing the value of the attribute
            switch(att.type.name) {
                case 'int':
                    code.push(this.printInt(temp2));
                    break;
                case 'double':
                    code.push(this.printDouble(temp2));
                    break;
                case 'char':
                    code.push(this.printChar(temp2));
                    break;
                case 'boolean':
                    let bool = this.printBoolean(temp2, label);
                    code.push(bool.code);
                    label = bool.label;
                    break;
                case 'string':
                    let str = this.printString(temp2, label, temp);
                    code.push(str.code);
                    label = str.label;
                    temp = str.temp;
                    break;
                case 'int[]':
                    let ir = this.printArray(temp2, temp, label, 'int');
                    label = ir.label;
                    temp = ir.temp;
                    code.push(ir.code);
                    break;
                case 'double[]':
                    let dr = this.printArray(temp2, temp, label, 'double');
                    label = dr.label;
                    temp = dr.temp;
                    code.push(dr.code);
                    break;
                case 'char[]':
                    let cr = this.printArray(temp2, temp, label, 'char');
                    label = cr.label;
                    temp = cr.temp;
                    code.push(cr.code);
                    break;
                case 'boolean[]':
                    let br = this.printArray(temp2, temp, label, 'boolean');
                    label = br.label;
                    temp = br.temp;
                    code.push(br.code);
                    break;
                case 'string[]':
                    let sr = this.printArray(temp2, temp, label, 'string');
                    label = sr.label;
                    temp = sr.temp;
                    code.push(sr.code);
                    break;
                default:
                    if (att.type.name.includes('[]')) {
                        // strc[]
                    }
                    else {
                        let objTDC = this.printObj(temp2, att.type.name, label, temp);
                        label = objTDC.label;
                        temp = objTDC.temp;
                        code.push(objTDC.code);
                    }
                    break;
            }
            if (i < attributes.length-1) {
                code.push('print("%c", 44);');
            }
            code.push('print("%c", 32);');
            code.push(`${temp1} = ${temp1} + 1;`);
        }
        code.push(`print("%c", 125);`);
        code.push(`${label2}:`);

        return {
            code: code.join('\n'),
            label: label,
            temp: temp
        }
    }

    printArray(value, temp, label, type) {
        let code = [];
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

        code.push(`${temp1} = 1;`);
        code.push(`${temp2} = heap[${value}];`);
        code.push(`${temp2} = ${temp2} + 1;`);
        code.push('print("%c", 91);');
        code.push('print("%c", 32);');
        code.push(`${label1}:`);
        code.push(`if (${temp1} == ${temp2}) goto ${label2};`);
        code.push(`${temp3} = ${value} + ${temp1};`);
        code.push(`${temp4} = heap[${temp3}];`);
        switch(type) {
            case 'int':
                code.push(this.printInt(temp4));
                break;
            case 'double':
                code.push(this.printDouble(temp4));
                break;
            case 'char':
                code.push(this.printChar(temp4));
                break;
            case 'boolean':
                let bool = this.printBoolean(temp4, label);
                code.push(bool.code);
                label = bool.label;
                break;
            case 'string':
                let str = this.printString(temp4, label, temp);
                code.push(str.code);
                label = str.label;
                temp = str.temp;
                break;
            default:
                let obj = this.printObj(temp4, type, label, temp);
                code.push(obj.code);
                temp = obj.temp;
                label = obj.label;
                break;
        }
        code.push('print("%c", 32);');
        code.push(`${temp1} = ${temp1} + 1;`);
        code.push(`goto ${label1};`);
        code.push(`${label2}:`);
        code.push('print("%c", 93);');
        return {
            label: label,
            temp: temp,
            code: code.join('\n')
        }
    }
}

module.exports.PrintSentence = PrintSentence;
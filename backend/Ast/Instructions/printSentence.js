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

        // TODO - write code according to expression type
        if (updater.type == null) {
            console.error('YOU LEFT AN EXPRESSION WITH OUT RETURNING TYPE');
        }
        switch(updater.type) {
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
                // TODO
                break;
            case 'double[]':
                // TODO
                break;
            case 'char[]':
                // TODO
                break;
            case 'boolean[]':
                // TODO
                break;
            case 'string[]':
                // TODO
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

    printInt(value) {
        return `print("%i", ${value});`;
    }

    printDouble(value) {
        return `print("%d", ${value});`;
    }

    printChar(value) {
        let code = [];
        code.push('print("%c", 39);');
        code.push(`print("%c", ${value});`);
        code.push('print("%c", 39);');
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
        return {
            code: code.join('\n'),
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

        code.push(`${temp1} = ${value};`);
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
                    break;
                case 'double[]':
                    break;
                case 'char[]':
                    break;
                case 'boolean[]':
                    break;
                case 'string[]':
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
            if (i < attributes.length-1) {
                code.push('print("%c", 44);');
            }
            code.push('print("%c", 32);');
            code.push(`${temp1} = ${temp1} + 1;`);
        }
        code.push(`print("%c", 125);`);

        return {
            code: code.join('\n'),
            label: label,
            temp: temp
        }
    }
}

module.exports.PrintSentence = PrintSentence;
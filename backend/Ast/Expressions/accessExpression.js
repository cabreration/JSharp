const Singleton = require('../../Procesor/Singleton/singleton').Singleton;
const SharpError = require('../../Procesor/Singleton/sharpError').SharpError;
const Updater = require('../Utilities/updater').Updater;

class AccessExpression {
    constructor(identifier, access_list, row, column) {
        this.identifier = identifier;
        this.access_list = access_list;
        this.row = row;
        this.column = column;
    } 

    getChildren() {
        return [ this.identifier, this.access_list ];
    }

    getDot() {
        return '[label="ACCESOS"];\n';
    }

    getTypeOf() {
        return 'accessexpression';
    }

    checkType(env) {
        // check that the symbol exists
        let symbol = null;
        let counter = 0;
        let thenv= env.id;
        while (thenv != null) {
            let enviroment = Singleton.getEnviroment(thenv);
            let res = enviroment.getSymbol(this.identifier.id);
            counter++;
            if (counter > 1) {
                spaces += enviroment.last;
            }
            if (res.state) {
                symbol = res.lead;
                break;
            }
            else {
                thenv = res.lead;
            }
        }

        if (symbol == null) {
            return new SharpError('Semantico', `La variable ${this.identifier.id} no existe en el contexto actual`, this.identifier.row, this.identifier.column)
        }

        if (symbol.type === 'int' || symbol.type == 'double' || symbol.type == 'char' || symbol.type == 'boolean') {
            new SharpError('Semantico', `Los elementos de tipos primitivo o string no cuentan con accesos`, this.row, this.column)
        }
        
        let varType = symbol.type;
        for (let i = 0; i < this.access_list.getChildren().length; i++) {
            let access = this.access_list.getChildren()[i];
            if (access.type === 1) {

                let strc = Singleton.getStrc(varType);
                if (strc == null) {
                    console.error("ALGO NO ESTA BIEN, ACCESSEXPRESSION.JS");
                    return new SharpError('Semantico', 'No se que paso', this.row, this.column);
                }

                let info = strc.getAttributeInfo(access.lead.id);
                if (info == null) {
                    return new SharpError('Semantico', `El tipo de dato ${this.parentType} no cuenta con un atributo ${this.lead.id}`, this.lead.row, this.lead.column);
                }
                varType = info.type;
            }
            else if (access.type === 2) {
                if (varType.includes('[]'))
                    varType = varType.replace('[]', '');
                else 
                    return new SharpError('Semantico', `El acceso por indices no puede usarse sobre valores de tipo ${varType}`, this.row, this.column);
            }
            else {
                switch (access.lead.id.id) {
                    case 'tochararray':
                        if (varType === 'string')
                            return 'char[]';
                        else 
                            return new SharpError('Semantico', `La funcion toCharArray no puede usarse sobre valores de tipo ${varType}`, this.row, this.column);
                    case 'charat':
                        if (varType === 'string')
                            return 'char'
                        else 
                            return new SharpError('Semantico', `La funcion charAt no puede usarse sobre valores de tipo ${varType}`, this.row, this.column);
                    case 'length':
                        if (varType === 'string')
                            return 'int';
                        else 
                            return new SharpError('Semantico', `La funcion length no puede usarse sobre valores de tipo ${varType}`, this.row, this.column);
                    case 'touppercase':
                    case 'tolowercase':
                        if (varType === 'string') 
                            return 'string'
                        else 
                            return new SharpError('Semantico', `La funcion ${access.lead.id.id} no puede usarse sobre valores de tipo ${varType}`, this.row, this.column);
                    case 'linealize':
                        if (varType.includes('[]'))
                            return varType;
                        else 
                            return new SharpError('Semantico', `La funcion linealiza no puede usarse sobre valores de tipo ${varType}`, this.row, this.column);
                }
            }
        }
        return varType;
    }

    getTDC(env, label, temp) {
        let code = [];
        // chequeamos que la variable exista
        let symbol = null;
        let counter = 0;
        let spaces = 0;
        let thenv= env.id;
        while (thenv != null) {
            let enviroment = Singleton.getEnviroment(thenv);
            let res = enviroment.getSymbol(this.identifier.id);
            counter++;
            if (counter > 1) {
                spaces += enviroment.last;
            }
            if (res.state) {
                symbol = res.lead;
                break;
            }
            else {
                thenv = res.lead;
            }
        }

        if (symbol == null) {
            Singleton.insertError(new SharpError('Semantico', `La variable ${this.identifier.id} no existe en el contexto actual`, this.identifier.row, this.identifier.column))
            return new Updater(env, label, temp, null);
        }

        if (symbol.type === 'int' || symbol.type == 'double' || symbol.type == 'char' || symbol.type == 'boolean') {
            Singleton.insertError(new SharpError('Semantico', `Los elementos de tipos primitivo o string no cuentan con accesos`, this.row, this.column));
            return new Updater(env, label, temp, null);
        }

        let varType = symbol.type;
        let absolute = `t${temp}`;
        temp++;

        let pos = symbol.position;
        let role = symbol.role;
        if (role === 'local var') {
            code.push(`t${temp} = p - ${spaces};`);
            temp++;
            code.push(`t${temp} = t${temp-1} + ${pos};`);
            code.push(`${absolute} = stack[t${temp}];`);
            temp++;
        }
        else if (role === 'global var') {
            code.push(`${absolute} = heap[${pos}];`);
        }
        else {
            console.error(role);
            console.error('ERROR 2 EN asignment.js');
        }

        for (let i = 0; i < this.access_list.getChildren().length; i++) {
            let access = this.access_list.getChildren()[i];
            if (access.type === 1) {
                if (varType.includes('[]')) {
                    if (access.lead.id != 'length') {
                        Singleton.insertError(new SharpError('Semantico', 'No es posible acceder por atributo en un elemento que es un arreglo', this.row, this.column));
                        return new Updater(env, label, temp, null);
                    }
                    else {
                        varType = 'int';
                        let temp1 = `t${temp}`;
                        temp++;
                        code.push(`${temp1} = heap[${absolute}];`);
                        code.push(`${absolute} = ${temp1};`);
                    }
                }
                else {
                    // buscar el nuevo tipo
                    access.addParentType(varType);
                    let obj = access.getTDC(env, label, temp);
                    if (obj.value == null) {
                        return new Updater(env, label, temp, null);
                    }
                    varType = access.myType;
                    if (obj.code != null) {
                        code.push(obj.code);
                        temp = obj.temp;
                        label = obj.label;
                    }

                    code.push(`${absolute} = ${absolute} + ${obj.value};`);
                    if (varType != 'int' && varType != 'double' && varType != 'boolean' && varType != 'char') {
                        let y = this.access_list.getChildren().length;
                        //if (i + 1 < this.access_list.getChildren().length) {
                            code.push(`${absolute} = heap[${absolute}];`);
                        //}
                        
                    }
                }
            }
            else if (access.type === 2) {
                if (!varType.includes('[]')) {
                    Singleton.insertError(new SharpError('Semantico', 'No es posible acceder a posiciones de un elemento que no es un arreglo', this.row, this.column));
                    return new Updater(env, label, temp, null);
                }
                else {
                    varType = varType.replace('[]', '');
                    // manejar las posiciones
                    let ar = access.getTDC(env, label, temp);
                    if (ar.value == null) {
                        return new Updater(env, label, temp, null);
                    }

                    if (ar.code != null) {
                        code.push(ar.code);
                        temp = ar.temp;
                        label = ar.label;
                    }
                    let t = `t${temp}`;
                    temp++;
                    code.push(`${t} = ${ar.value} + 1;`);
                    code.push(`${absolute} = ${absolute} + ${t};`);
                    if (varType != 'int' && varType != 'double' && varType != 'boolean' && varType != 'char') {
                        //if (i + 1 < this.access_list.getChildren().length) {
                            code.push(`${absolute} = heap[${absolute}];`);
                        //}
                        
                    }
                }
            }
            else {
                switch (access.lead.id.id) {
                    case 'tochararray':
                        if (varType === 'string') {
                            // crear una funcion que convierta la cadena en un arreglo y retornar su referencia
                            let tca = this.toCharArray(temp, label, absolute);
                            varType = 'char[]';
                            temp = tca.temp;
                            label = tca.label;
                            code.push(tca.label);
                            absolute = tca.value;
                        }
                        else {
                            Singleton.insertError(new SharpError('Semantico', `La funcion toCharArray no puede usarse sobre valores de tipo ${varType}`, this.row, this.column));
                            return new Updater(env, label, temp, null);
                        }
                    case 'charat':
                        if (varType === 'string') {
                            // get the parameter
                            let par = access.lead.exList.getChildren()[0];
                            let parTDC = par.getTDC(env, label, temp);
                            if (parTDC.value == null) {
                                return new Updater(env, label, temp, null);
                            }
                            if (parTDC.code != null) {
                                code.push(parTDC.code);
                                temp = parTDC.temp;
                                label = parTDC.label;
                            }
                            varType = 'char';
                            let cat = this.characterAt(label, temp, absolute, parTDC.value);
                            temp = cat.temp;
                            label = cat.label;
                            code.push(cat.code);
                            absolute = cat.value;
                        }
                        else {
                            Singleton.insertError(new SharpError('Semantico', `La funcion charAt no puede usarse sobre valores de tipo ${varType}`, this.row, this.column));
                            return new Updater(env, label, temp, null);
                        }
                    case 'length':
                        if (varType === 'string') {
                            let strl = this.strLength(label, temp, absolute);
                            label = strl.label;
                            temp = strl.temp;
                            code.push(strl.code);
                            absolute = strl.value;
                            varType = 'int';
                        }
                        else {
                            Singleton.insertError(new SharpError('Semantico', `La funcion length no puede usarse sobre valores de tipo ${varType}`, this.row, this.column));
                            return new Updater(env, label, temp, null);
                        } 
                    case 'touppercase':
                        if (varType === 'string') {

                        }
                        else {
                            Singleton.insertError(new SharpError('Semantico', `La funcion toUpperCase no puede usarse sobre valores de tipo ${varType}`, this.row, this.column));
                            return new Updater(env, label, temp, null);
                        }
                        break;
                    case 'tolowercase':
                        if (varType === 'string') {

                        }
                        else {
                            Singleton.insertError(new SharpError('Semantico', `La funcion toLowerCase no puede usarse sobre valores de tipo ${varType}`, this.row, this.column));
                            return new Updater(env, label, temp, null);
                        }
                    case 'linealize':
                        if (varType.includes('[]')) {
                            // nada mas crear un nuevo arreglo que sea igual y eso se retorna
                        }
                        else if (varType === 'string') {

                        }
                        else {
                            Singleton.insertError(new SharpError('Semantico', `La funcion Linealize no puede usarse sobre valores de tipo ${varType}`, this.row, this.column));
                            return new Updater(env, label, temp, null);
                        }
                }
            }
        }
        let up = new Updater(env, label, temp, code.join('\n'));
        up.addValue(absolute);
        up.addType(varType);
        return up;
    }

    toCharArray(temp, label, value) {
        let code = [];
        let temp1 = `t${temp}`;
        temp++;
        let temp2 = `t${temp}`;;
        temp++;
        let temp3 = `t${temp}`;
        temp++;
        let temp4 = `t${temp}`;
        temp++;
        let temp5 = `t${temp}`;
        temp++;
        let init = `t${temp}`;
        temp++;
        let label1 = `L${label}`;
        label++;
        let label2 = `L${label}`;
        label++;
        let label3 = `L${label}`;
        label++;
        let label4 = `L${label}`;
        label++;
        
        code.push(`${temp1} = ${value};`);
        code.push(`${temp2} = 0;`)
        code.push(`${label1}:`)
        code.push(`${temp3} = heap[${temp1}];`)
        code.push(`if (${temp3} == 0) goto ${label2};`)
        code.push(`${temp2} = ${temp2} + 1;`);
        code.push(`${temp1} = ${temp1} + 1;`);
        code.push(`goto ${label1};`);
        code.push(`${label2}:`);
        code.push(`${init} = h;`);
        code.push(`heap[h] = ${temp2};`)
        code.push(`h = h + 1;`);
        code.push(`${temp4} = ${value};`)
        code.push(`${label3}:`);
        code.push(`${temp5} = heap[${temp4}];`);
        code.push(`if (${temp5} == 0) goto ${label4};`);
        code.push(`heap[h] = ${temp5};`);
        code.push(`h = h + 1;`);
        code.push(`${temp4} = ${temp4} + 1;`);
        code.push(`goto ${label3};`)
        code.push(`${label4}:`);
        return {
            code: code.join('\n'),
            temp: temp,
            label: label, 
            value: init
        }
    }

    strLength(label, temp, value) {
        let code = [];
        let temp1 = `t${temp}`;
        temp++;
        let temp2 = `t${temp}`;;
        temp++;
        let temp3 = `t${temp}`;
        temp++;
        let label1 = `L${label}`;
        label++;
        let label2 = `L${label}`;
        label++;
        
        code.push(`${temp1} = ${value};`);
        code.push(`${temp2} = 0;`)
        code.push(`${label1}:`)
        code.push(`${temp3} = heap[${temp1}];`)
        code.push(`if (${temp3} == 0) goto ${label2};`)
        code.push(`${temp2} = ${temp2} + 1;`);
        code.push(`${temp1} = ${temp1} + 1;`);
        code.push(`goto ${label1};`);
        code.push(`${label2}:`);

        return {
            label: label,
            temp: temp,
            code: code.join('\n'),
            value: temp2
        }
    }

    characterAt(label, temp, value, position) {
        let code = [];
        let temp1 = `t${temp}`;
        temp++;
        let temp2 = `t${temp}`;;
        temp++;
        let temp3 = `t${temp}`;
        temp++;
        let label1 = `L${label}`;
        label++;
        let label2 = `L${label}`;
        label++;
        
        code.push(`${temp1} = ${value};`)
        code.push(`${temp2} = 0;`)
        code.push(`${label1}:`)
        code.push(`${temp3} = heap[${temp1}];`)
        code.push(`if (${temp2} == ${position}) goto ${label2};`)
        code.push(`${temp1} = ${temp1} + 1;`);
        code.push(`goto ${label1};`);
        code.push(`${label2}:`);

        return {
            label: label,
            temp: temp,
            code: code.join('\n'),
            value: temp2
        }
    }

    upper(label, temp, value) {
        let code = [];
        let init = `t${temp}`;
        temp++;
        let temp4 = `t${temp}`;
        temp++;
        let temp5 = `t${temp}`;
        temp++;
        let init = `t${temp}`;
        temp++;
        let label1 = `L${label}`;
        label++;
        let label2 = `L${label}`;
        label++;
        let label3 = `L${label}`;
        label++;
        let label4 = `L${label}`;
        label++;
        
        code.push(`${init} = h;`);
        code.push(`${temp4} = ${value};`)
        code.push(`${label1}:`);
        code.push(`${temp5} = heap[${temp4}];`);
        code.push(`if (${temp5} == 0) goto ${label2};`);
        code.push(`if (${temp5} < 97) goto ${label3};`);
        code.push(`if (${temp5} > 122) goto ${label3};`);
        code.push(`if (${temp5} == 164) goto ${label4};`);
        code.push(`${temp5} = ${temp5} - 32;`)
        code.push(`goto ${label3};`)
        code.push(`${label4}:`)
        code.push(`${temp5} = 165;`);
        code.push(`${label3}:`);
        code.push(`heap[h] = ${temp5};`);
        code.push(`h = h + 1;`);
        code.push(`${temp4} = ${temp4} + 1;`);
        code.push(`goto ${label1};`)
        code.push(`${label2}:`);
        return {
            code: code.join('\n'),
            temp: temp,
            label: label, 
            value: init
        }
    }

    lower(label, temp, value) {
        let code = [];
        let init = `t${temp}`;
        temp++;
        let temp4 = `t${temp}`;
        temp++;
        let temp5 = `t${temp}`;
        temp++;
        let init = `t${temp}`;
        temp++;
        let label1 = `L${label}`;
        label++;
        let label2 = `L${label}`;
        label++;
        let label3 = `L${label}`;
        label++;
        let label4 = `L${label}`;
        label++;
        
        code.push(`${init} = h;`);
        code.push(`${temp4} = ${value};`)
        code.push(`${label1}:`);
        code.push(`${temp5} = heap[${temp4}];`);
        code.push(`if (${temp5} == 0) goto ${label2};`);
        code.push(`if (${temp5} < 65) goto ${label3};`);
        code.push(`if (${temp5} > 90) goto ${label3};`);
        code.push(`if (${temp5} == 165) goto ${label4};`);
        code.push(`${temp5} = ${temp5} + 32;`)
        code.push(`goto ${label3};`)
        code.push(`${label4}:`)
        code.push(`${temp5} = 164;`);
        code.push(`${label3}:`);
        code.push(`heap[h] = ${temp5};`);
        code.push(`h = h + 1;`);
        code.push(`${temp4} = ${temp4} + 1;`);
        code.push(`goto ${label1};`)
        code.push(`${label2}:`);
        return {
            code: code.join('\n'),
            temp: temp,
            label: label, 
            value: init
        }
    }

    linealize(label, temp, value) {
        let code = [];
        let temp4 = `t${temp}`;
        temp++;
        let temp5 = `t${temp}`;
        temp++;
        let init = `t${temp}`;
        temp++;
        let label3 = `L${label}`;
        label++;
        let label4 = `L${label}`;
        label++;
        
        code.push(`${init} = h;`);
        code.push(`${temp4} = ${value};`)
        code.push(`${temp5} = heap[${temp4}];`);
        code.push(`heap[h] = ${temp5};`);
        code.push('h + h + 1;');
        code.push(`${temp4} = ${temp4} + 1;`);
        code.push(`${label3}:`);
        code.push(`${temp5} = heap[${temp4}];`);
        code.push(`if (${temp5} == 0) goto ${label4};`);
        code.push(`heap[h] = ${temp5};`);
        code.push(`h = h + 1;`);
        code.push(`${temp4} = ${temp4} + 1;`);
        code.push(`goto ${label3};`)
        code.push(`${label4}:`);
        return {
            code: code.join('\n'),
            temp: temp,
            label: label, 
            value: init
        }
    }
}

module.exports.AccessExpression = AccessExpression;
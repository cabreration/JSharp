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
                switch (access.lead.id) {
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
                            return new SharpError('Semantico', `La funcion ${access.lead.id} no puede usarse sobre valores de tipo ${varType}`, this.row, this.column);
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
                    Singleton.insertError(new SharpError('Semantico', 'No es posible acceder por atributo en un elemento que es un arreglo', this.row, this.column));
                    return new Updater(env, label, temp, null);
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
                // TODO - aqui si tengo que trabajar las funciones y devolve los resultados
            }
        }
        let up = new Updater(env, label, temp, code.join('\n'));
        up.addValue(absolute);
        up.addType(varType);
        return up;
    }
}

module.exports.AccessExpression = AccessExpression;
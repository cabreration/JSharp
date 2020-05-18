const Singleton = require('../../Procesor/Singleton/singleton').Singleton;
const SharpError = require('../../Procesor/Singleton/sharpError').SharpError;
const Updater = require('../Utilities/updater').Updater;

class Asignment {
    constructor(id, accessList, expression, row, column) {
        this.id = id; // Identifier
        this.accessList = accessList; // nodelist -> [ accesslist ]
        this.expression = expression; // expression
        this.row = row; // number
        this.column = column; // number
    }

    getDot() {
        return '[label="ASIGNMENT"];\n';
    }

    getChildren() {
        if (this.accessList != null)
            return [this.id, this.accessList, this.expression];
        else 
            return [this.id, this.expression]
    }

    getTypeOf() {
        return 'asignment';
    }

    getTDC(env, label, temp) {
        if (this.accessList == null) {
            let code = [];

            // check the variable type
            let varType = this.id.checkType(env);
            if (typeof(varType) === 'object') {
                // ERROR
                Singleton.insertError(varType);
                return new Updater(env, label, temp, null);
            }

            // check that the variable that we are trying to asign exists
            let symbol = null;
            let counter = 0;
            let spaces = 0;
            let thenv= env.id;
            while (thenv != null) {
                let enviroment = Singleton.getEnviroment(thenv);
                let res = enviroment.getSymbol(this.id.id);
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
                Singleton.insertError(new SharpError('Semantico', `La variable ${this.id.id} no existe en el contexto actual`, this.id.row, this.id.column))
                return new Updater(env, label, temp, null);
            }

            // check it is not a constant
            if (symbol.constant) {
                Singleton.insertError(new SharpError('Semantico', `"${this.id.id}" es una constante`, this.row, this.column));
                return new Updater(env, label, temp, null);
            }

            // get the expression type
            let expType = this.expression.checkType(env);
            if (typeof(expType) === 'object') {
                Singleton.insertError(expType);
                return new Updater(env, label, temp, null);
            }

            // check that types match
            if (varType != expType) {
                let flag = false;
                if (varType === 'double') {
                    if (expType === 'int' || expType === 'char') {
                        flag = true;
                    }
                }
                else if (varType === 'int') {
                    if (expType === 'char') {
                        flag = true;
                    }
                }

                if (!flag) {
                    Singleton.insertError(new SharpError('Semantico', `"${this.id.id}" es una variable de tipo ${varType}, mientras que la expresion es de tipo ${expType}`, this.row, this.column));
                    return new Updater(env, label, temp, null);
                }
            }

            // get the value from the expression
            let updater = this.expression.getTDC(env, label, temp);
            label = updater.label;
            temp = updater.temp;
            if (updater.code != null)
                code.push(updater.code);

            // TODO - asign the value to the variable
            let pos = symbol.position;
            let role = symbol.role;
            if (role === 'global var') {
                code.push(`heap[${pos}] = ${updater.value};`);
            }
            else if (role === 'local var') {
                code.push(`t${temp} = p - ${spaces};`);
                temp++;
                code.push(`t${temp} = t${temp-1} + ${pos};`);
                code.push(`stack[t${temp}] = ${updater.value};`);
                temp++;
            }
            else {
                console.error(role);
                console.error('ERROR EN asignment.js');
            }
            if (code.length > 0) 
                return new Updater(env, label, temp, code.join('\n'));
            else 
                return new Updater(env, label, temp, null);
        }
        else {
            // Hay accesos
            let code = [];

            // chequeamos que la variable exista
            let symbol = null;
            let counter = 0;
            let spaces = 0;
            let thenv= env.id;
            while (thenv != null) {
                let enviroment = Singleton.getEnviroment(thenv);
                let res = enviroment.getSymbol(this.id.id);
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
                Singleton.insertError(new SharpError('Semantico', `La variable ${this.id.id} no existe en el contexto actual`, this.id.row, this.id.column))
                return new Updater(env, label, temp, null);
            }

            if (symbol.type === 'int' || symbol.type == 'double' || symbol.type == 'char' 
            || symbol.type == 'boolean' || symbol.type == 'string') {
                Singleton.insertError(new SharpError('Semantico', `Los elementos de tipos primitivo o string no cuentan con accesos asignables`, this.id.row, this.id.column));
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

            for (let i = 0; i < this.accessList.getChildren().length; i++) {
                let access = this.accessList.getChildren()[i];
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
                        //let t = `t${temp}`;
                        //temp++;
                        //code.push(`${t} = ${obj.value} + 1;`);
                        code.push(`${absolute} = ${absolute} + ${obj.value};`);
                        if (varType != 'int' && varType != 'double' && varType != 'boolean' && varType != 'char') {
                            if (i + 1 < this.accessList.getChildren().length) {
                                code.push(`${absolute} = heap[${absolute}];`);
                            }
                            
                        }
                    }
                }
                else if (access.type === 2) {
                    if (!varType.includes('[]')  && varType != 'global') {
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
                            if (i + 1 < this.accessList.getChildren().length) {
                                code.push(`${absolute} = heap[${absolute}];`);
                            }
                            
                        }
                    }
                }
                else {
                    Singleton.insertError(new SharpError('Semantico', 'No existen funciones asignables en J#', this.row, this.column));
                    return new Updater(env, label, temp, null);
                }
            }
            
            // get the expression type
            let expType = this.expression.checkType(env);
            if (typeof(expType) === 'object') {
                Singleton.insertError(expType);
                return new Updater(env, label, temp, null);
            }

            // check that types match
            if (varType != expType) {
                let flag = false;
                if (varType === 'double') {
                    if (expType === 'int' || expType === 'char') {
                        flag = true;
                    }
                }
                else if (varType === 'int') {
                    if (expType === 'char') {
                        flag = true;
                    }
                }

                if (!flag) {
                    Singleton.insertError(new SharpError('Semantico', `"${this.id.id}" es una variable de tipo ${varType}, mientras que la expresion es de tipo ${expType}`, this.row, this.column));
                    return new Updater(env, label, temp, null);
                }
            }

            // get the value from the expression
            let updater = this.expression.getTDC(env, label, temp);
            label = updater.label;
            temp = updater.temp;
            if (updater.code != null)
                code.push(updater.code);

            code.push(`heap[${absolute}] = ${updater.value};`)
            return new Updater(env, label, temp, code.join('\n'));
        }
    }
        
}

module.exports.Asignment = Asignment;
const Singleton = require('../../Procesor/Singleton/singleton').Singleton;
const SharpError = require('../../Procesor/Singleton/sharpError').SharpError;
const Updater = require('../Utilities/updater').Updater;

class Call {
    constructor(id, expList) {
        this.id = id; // Identifier
        this.expList = expList; // nodeList -> [ expression, asignment ]
    }

    getDot() {
        return '[label="CALL"];\n';
    }

    getChildren() {
        if (this.expList.length > 0)
            return [ this.id, this.expList ];
        else 
            return [ this.id ]
    }

    getTypeOf() {
        return 'call';
    }

    checkType(env) {
        let filt = filter(env);
        if (!filt.state) {
            return filt.error;
        }
        else {
            return filt.lead.role;
        }
    }

    filter(env) {
        // get function 
        let options = Singleton.getFunctions(this.id.id);
        if (options.length == 0) {
            return {
                state: false,
                error: new SharpError('Semantico', `La funcion ${this.id.id} no ha sido definida`, this.id.row, this.id.column)
            }
        }

        // choose the right option
        let paramsCount = this.expList.getChildren().length;
        let filteredOptions = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].paramsCount === paramsCount) {
                filteredOptions.push(options[i]);
            }
        }

        if (filteredOptions.length === 0) {
            return {
                state: false,
                error: new SharpError('Semantico', `No existe ninguna definicion para la funcion ${this.id.id} que incluya la cantidad de parametros especificada`, this.id.row, this.id.column)
            }
        }

        // obtaining the types of the arguments passed in the call
        let types = [];
        let exps = this.expList.getChildren();
        for (let i = 0; i < exps.length; i++) {
            let currentType;
            let name;
            if (exps[i].getTypeOf() === 'asignment') {
                currentType = exps[i].expression.checkType(env);
                name = exps[i].id;
            }
            else {
                currentType = exps[i].checkType(env);
                name = null;
            }
            if (typeof(currentType) === 'object') {
                return {
                    state: false,
                    error: currentType
                }
            }

            let obj = { type: currentType, name: name }
            types.push(obj);
        }

        // comparamos los tipos obtenidos contra los tipos en el ambito de la funcion
        let func = null;
        for (let i = 0; i < filteredOptions.length; i++) {
            let flag = true;
            func = filteredOptions[i];
            // TODO - we should sort here according to the current function
            types = this.sortParameters2(func, types);
            for (let j = 0; j < types.length; j++) {
                if (filteredOptions[i].symbols[j].type != types[j].type) {
                    flag = false;
                    func = null;
                    break;
                }
            }
        }

        if (func == null) {
            // now we try implicitly casting types
            for (let i = 0; i < filteredOptions.length; i++) {
                let flag = true;
                func = filteredOptions[i];
                for (let j = 0; j < types.length; j++) {
                    if (filteredOptions[i].symbols[j].type != types[j]) {
                        if (types[j] === 'int') {
                            if (filteredOptions[i].symbols[j].type != 'double') {
                                flag = false;
                                func = null;
                                break;
                            }
                        }
                        else if (types[j] === 'char') {
                            if (filteredOptions[i].symbols[j].type != 'int' 
                            && filteredOptions[i].symbols[j].type != 'double') {
                                flag = false;
                                func = null;
                                break;
                            }
                        }
                        else {
                            flag = false;
                            func = null;
                            break;
                        }
                    }
                }
            }
            if (func == null) {
                return {
                    state: false,
                    error: new Error('Semantico', `No existe la definicion de ${this.id.id} con tal numero y tipo de parametros`, this.id.row, this.id.column)
                }
            }
        }
        else {
            return {
                state: true,
                lead: func
            }
        }
    }

    getTDC(env, label, temp) {
        let filtered = this.filter(env);
        if (!filtered.state) {
            Singleton.insertError(filtered.error);
            return new Updater(env, label, temp, null);
        }

        let proc = filtered.lead;
        let code = [];
        let params = this.expList.getChildren();
        let val;
        // has parameters
        params = this.sortParameters(proc, params);
        code.push(`p = p + ${env.last};`);
        // push the value of the parameters to the stack
        for (let i = 0; i < params.length; i++) {
            arg = params[i];
            let argCode = arg.getTDC(env, label, temp);
            temp = argCode.temp;
            label = argCode.label;
            code.push(argCode.code);
            code.push(`t${temp} = ${argCode.value};`);
            code.push(`stack[p] = t${temp};`);
            temp++;
        }
        code.push(`call ${proc.id};`);
        code.push(`t${temp} = stack[p];`);
        code.push(`p = p - ${env.last};`);
        val = `t${temp}`;
        temp++;
        let updater = new Updater(env, label, temp, code.join('\n'));
        updater.addValue(val);
        updater.addType(proc.role);
        return updater;
    }

    sortParameters(env, params) {
        let compareTo = []; // store the names of the parameters
        let count = env.paramsCount;
        for (let i = 1; i <= count; i++) {
            compareTo.push(env.symbols[i].id);
        }

        let sorted = [];
        for (let i = 0; i < params.length; i++) {
            if (params[i].getTypeOf() === 'asignment') {
                for (let j = 0; j < compareTo.length; j++) {
                    if (params[i].id.id === compareTo[j]) {
                        sorted[j] = params[i];
                        break;
                    }
                }
            }
            else {
                sorted[i] = params[i];
            }
        }
        return sorted;
    }

    sortParameters2(env, params) {
        let compareTo = []; // store the names of the parameters
        let count = env.paramsCount;
        for (let i = 1; i <= count; i++) {
            compareTo.push(env.symbols[i].id);
        }

        let sorted = [];
        for (let i = 0; i < params.length; i++) {
            if (params[i].name != null) {
                let flag = false;
                for (let j = 0; j < compareTo.length; j++) {
                    if (params[i].name === compareTo[j]) {
                        sorted[j] = params[i];
                        flag = true;
                        break;
                    }
                }
                if (!flag) {
                    return params;
                }
            }
            else {
                sorted[i] = params[i];
            }
        }
        return sorted;
    }
}

module.exports.Call = Call;
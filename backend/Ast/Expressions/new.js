const Singleton = require('../../Procesor/Singleton/singleton').Singleton;
const SharpError = require('../../Procesor/Singleton/sharpError').SharpError;
const Updater = require('../Utilities/updater').Updater;

class New {
    constructor(identifier) {
        this.identifier = identifier; //Identifier
        this.byValue = false;
    }

    byValue() {
        this.byValue = true;
    }

    getDot() {
        return '[label=" strc: ' + this.identifier.id + '"];\n';
    }

    getChildren() {
        return [];
    }

    getTypeOf() {
        return 'new';
    }

    checkType(env) {
        let type = Singleton.getStrc(this.identifier.id);
        if (type == null) {
            return new SharpError('Semantico', `El tipo de dato ${this.identifier.id} no ha sido definido`, this.identifier.row, this.identifier.column);
        }
        
        return type.identifier.id;
    }

    getTDC(env, label, temp) {
        let code = [];
        let strc = Singleton.getStrc(this.identifier.id);
        let attributes = strc.attributes.getChildren();

        for (let i = 0; i < attributes.length; i++) {
            // validate every attribute
            let validation = attributes[i].validateAttribute();
            if (typeof(validation) === 'object') {
                Singleton.insertError(validation);
                return new Updater(env, label, temp, null);
            }
        }

        // after validating each attribute we translate each attribute.
        let updaters = [];
        let runnerTemp = temp;
        let runnerLabel = label;
        for (let i = 0; i < attributes.length; i++) {
            let updater = attributes[i].getTDC(env, runnerLabel, runnerTemp);
            if (updater.code == null) {
                return updater;
            }
            runnerLabel = updater.label;
            runnerTemp = updater.temp;
            updaters.push(updater);
        }

        let val = `t${temp}`;
        temp++;
        code.push(`${val} = h;`);
        updaters.forEach(up => {
            code.push(up.code);
        });

        let updater = new Updater(env, runnerLabel, runnerTemp, code.join('\n'));
        updater.addValue(val);
        updater.addType(this.identifier.id);
        return updater;
    }
}

module.exports.New = New;
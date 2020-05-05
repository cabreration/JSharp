class VarT4 {
    // global
    constructor(identifier, expression) {
        this.identifier = identifier; // Identifier
        this.expression = expression; // Expression
    }

    getDot() {
        return '[label="VARIABLE DECLARATION - T4"];\n';
    }

    getChildren() {
        return [ this.identifier, this.expression ];
    }

    getTypeOf() {
        return 'vart4';
    }

    getTDC(env, label, temp) {
        // validate expression
        let expType = this.expression.checkType(env.id);
        if (typeof(expType) === 'object') {
            Singleton.insertError(expType);
            return new Updater(env, label, temp, null);
        }

        // change type of symbol
        let symbol = env.getSymbol(this.identifier.id);
        if (!symbol.state) {
            return new Updater(env, label, temp, null);
        }
        symbol.lead.type = expType;

        // get the code 
        let code = [];
        let fUpdater = this.expression.getTDC(env, label, temp);
        let expValue = fUpdater.value;
        env = fUpdater.env;
        label = fUpdater.label;
        temp = fUpdater.temp;
        if (fUpdater.code != null)
            code.push(fUpdater.code);

        let pos = symbol.lead.position;
        code.push(`heap[${pos}] = ${expValue};`);
        if (code.length === 0) {
            return new Updater(env, label, temp, null);
        }
        else {
            return new Updater(env, label, temp, code.join('\n'));
        }
    }
}

module.exports.VarT4 = VarT4;
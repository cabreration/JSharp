class Temps {
    constructor(temps) {
        this.temps = temps;
    }

    print(flag) {
        let code = 'var ';
        for (let i = 0; i < this.temps.length - 1; i++) {
            code += this.temps[i] + ', ';
        }
        code += this.temps[this.temps.length - 1] + ';';
        return code;
    }
}

module.exports.Temps = Temps;
class Updater {
    constructor(env, label, temp, code) {
        this.env = env;
        this.label = label;
        this.temp = temp;
        this.code = code;
        this.value = null;
        this.type = null;
    }

    addValue(temp) {
        this.value = temp;
    }

    addType(type) {
        this.type = type;
    }
}

module.exports.Updater = Updater;
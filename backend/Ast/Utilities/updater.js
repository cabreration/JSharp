class Updater {
    constructor(env, label, temp, code) {
        this.env = env;
        this.label = label;
        this.temp = temp;
        this.code = code;
        this.value = null;
        this.type = null;
        this.size = -1;
    }

    addValue(temp) {
        this.value = temp;
    }

    addType(type) {
        this.type = type;
    }

    addSize(size) {
        this.size = size;
    }
}

module.exports.Updater = Updater;
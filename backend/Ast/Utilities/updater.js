class Updater {
    constructor(env, label, temp, h, p, code) {
        this.env = env;
        this.label = label;
        this.temp = temp;
        this.h = h;
        this.p = p;
        this.code = code;
        this.value = null;
        this.type = null;
        this.ref = null;
    }

    addValue(temp) {
        this.value = temp;
    }

    addType(type) {
        this.type = type;
    }

    addReference(ref) {
        this.ref = ref;
    }
}

module.exports.Updater = Updater;
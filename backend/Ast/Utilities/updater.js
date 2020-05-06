class Updater {
    constructor(env, label, temp, code) {
        this.env = env;
        this.label = label;
        this.temp = temp;
        this.code = code;
        this.value = null;
        this.type = null;
        this.falseLabels = null;
        this.trueLabels = null;
    }

    addValue(temp) {
        this.value = temp;
    }

    addType(type) {
        this.type = type;
    }

    addTLabels(labels) {
        this.trueLabels = labels;
    }

    addFLabels(labels) {
        this.falseLabels = labels;
    }
}

module.exports.Updater = Updater;
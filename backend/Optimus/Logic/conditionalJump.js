class ConditionalJump {
    constructor(condition, label, row) {
        this.condition = condition;
        this.label = label;
        this.row = row;
    }

    print() {
        return `if ${this.condition.print()} goto ${this.label};`;
    }
}

module.exports.ConditionalJump = ConditionalJump;

class Import {
    constructor(files) {
        this.files = files; // [ Identifier ]
    }

    getDot() {
        return '[label="IMPORT"];\n';
    }

    getChildren() {
        return this.files;
    }

    getTypeOf() {
        return 'import';
    }
}

module.exports.Import = Import;
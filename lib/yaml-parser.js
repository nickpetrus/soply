const {promisify} = require('util');
const fs = require('fs');
const readFile = promisify(fs.readFile);
const YAML = require('yaml');

module.exports = class YamlParser {
    constructor() {
    }

    async parse(path) {
        const file = await readFile(path, 'utf8');
        return YAML.parse(file);
    }

};

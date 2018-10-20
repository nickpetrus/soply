const VarExtractor = require("./var-extractor");
const FileResolver = require("./file-resolver");
const YamlParser = require("./yaml-parser");
const VarRepo = require("./var-repo");
const EntityAdapter = require("./entity-adapter");
const {ExportsEnvVarWriter, PlainEnvVarWriter} = require('./env-var-writer');

module.exports = class App {
    constructor() {
    }

    async process({name, globs, format}) {
        const extractor = new VarExtractor(new FileResolver(), new YamlParser(), new VarRepo(), new EntityAdapter());
        const variables = await extractor.extract(name, globs);
        const writer = format === 'exports' ? new ExportsEnvVarWriter() : new PlainEnvVarWriter();
        return await writer.write(variables);
    }
};

class EnvVarWriter {
    constructor(separator) {
        this.separator = separator;
    }

    async write(configs) {
        return configs.map(x => configToArray(x)).flat().join(this.separator);
    }

    configToArray(config) {
        if (config == null) {
            return []
        }
        const result = [];
        for (const key in config) {
            if (config.hasOwnProperty(key)) {
                result.push(`${key}='${config[key]}'`);
            }
        }
        return result;
    }
}

exports.PlainEnvVarWriter = class PlainEnvVarWriter extends EnvVarWriter {
    constructor() {
        super(' ');
    }
};

exports.ExportsEnvVarWriter = class ExportsEnvVarWriter extends EnvVarWriter {
    constructor() {
        super('; export ');
    }
};

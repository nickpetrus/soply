module.exports = class VarRepo {
    constructor() {
        this.repo = {};
    }

    async register(name, config) {
        repo[name] = config;
    }

    async resolve({name, prefix, optional}) {
        const config = repo[name];
        if (config == null) {
            if (optional) {
                return null;
            }
            throw new Error(`Missing config or secret ${name}`);
        }

        if (prefix == null) {
            return config;
        }

        const result = {};
        for (const key in config) {
            if (config.hasOwnProperty(key)) {
                result[prefix + key] = config[key];
            }
        }

        return result;
    }
};

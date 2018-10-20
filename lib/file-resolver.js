const {promisify} = require('util');
const glob = require('glob');
const globAsync = promisify(glob);

module.exports = class FileResolver {
    constructor() {
    }

    async resolve(glob) {
        return await globAsync(glob);
    }
};

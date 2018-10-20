module.exports = class VarExtractor {
    constructor(fileResolver, yamlParser, varRepo, entityAdapter) {
        this.fileResolver = fileResolver;
        this.yamlParser = yamlParser;
        this.varRepo = varRepo;
        this.entityAdapter = entityAdapter;
    }

    async extract(name, globs) {
        const candidates = await Promise.all(globs.map(glob => this.separatePerGlob(name, glob)));

        let candidate;
        for(const globCandidates of candidates){
            candidate = globCandidates.find(x => x != null);
            if(candidate != null){
                break;
            }
        }
        if (candidate == null) {
            throw new Error(`Missing consumer with requested name ${name}`);
        }

        return candidate.required.map(x => this.varRepo.resolve(x));
    }

    async separatePerGlob(name, glob){
        const files = await this.fileResolver.resolve(glob);
        return await Promise.all(files.map(file => this.separate(name, file)))
    }

    async separate(name, file) {
        const yaml = await this.yamlParser.parse(file);
        const entity = this.entityAdapter.adapt(yaml);

        if (entity.type === 'config') {
            this.varRepo.register(entity, name, entity.config);
            return;
        }

        if (entity.name === name) {
            return entity;
        }
    }
};

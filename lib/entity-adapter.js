class Entity {
    constructor(data) {
        this.data = data;
    }

    get name() {
        return this.data.metadata.name;
    }

    get type() {
        throw new Error('Not implemented exception');
    }
}

class Config extends Entity {
    constructor(data) {
        super(data);
    }

    get type() {
        return 'config';
    }

    get name() {
        return this.wrapName(super.name);
    }

    get config() {
        return this.data.data;
    }
}

class ConfigMap extends Config {
    constructor(data) {
        super(data);
    }

    wrapName(name) {
        return Config.wrapName(name);
    }

    static wrapName(name) {
        return `ConfigMap[${name}]`;
    }
}

class Secret extends Config {
    constructor(data) {
        super(data);
    }

    wrapName(name) {
        return Secret.wrapName(name);
    }

    static wrapName(name) {
        return `Secret[${name}]`;
    }
}


class Consumer extends Entity {
    constructor(data) {
        super(data);
    }

    get type() {
        return 'consumer';
    }

    get requred() {
        return this.extractRequiredFromContainers(this.data.spec.containers);
    }

    extractRequiredFromContainers(containers) {
        return containers.map(x => x.envFrom.map(this.extractFromEnvFrom)).flat();
    }

    extractFromEnvFrom(envFrom) {
        const conf = envFrom.secretRef || envFrom.configMapRef;
        const entity = envFrom.secretRef ? Secret : ConfigMap;
        return {
            prefix: envFrom.prefix,
            name: entity.wrapName(conf.name),
            optional: conf.optional,
        };
    }
}

const kindToEntity = {
    Secret: Secret,
    ConfigMap: ConfigMap,
    DaemonSet: Consumer,
    Deployment: Consumer,
    ReplicaSet: Consumer,
    StatefulSet: Consumer,
    Job: Consumer,
    ReplicationController: Consumer,
    CronJob: Consumer,
    Pod: Consumer,
    PodTemplate: Consumer,
};

class InvalidEntity extends Error {
    constructor(message, data) {
        super(message);
        this.data = data;
    }
}

module.exports = class EntityAdapter {
    constructor() {
    }

    async adapt(data) {
        if (data.kind == null) {
            throw new InvalidEntity('Entity missing property "kind"', data);
        }

        const entityClass = kindToEntity[data.kind];
        if (entityClass == null) {
            throw new InvalidEntity(`Unexpected entity with kind=${data.kind}`, data);
        }

        return new entityClass(data);
    }
};

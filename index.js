const program = require('commander');
const pack = require('./package.json');
const App = require('./lib/app');

program
    .version(pack.version)
    .option('-o, --format <format>', 'Output format', /^(exports|plain)$/i, 'plain');

program
    .command('* <name> <globs...>')
    .description('Resolves globs to k8s entities and returns env variables for entity with provided name')
    .action(async function (name, globs) {
        const {format} = program;
        const app = new App();
        let ouput;
        try {
            output = await app.process({name, globs, format});
        } catch (e) {
            if (e instanceof Error){
                console.log(e.message);
                return;
            }
        }
        console.log(output);
    })
    .on('--help', function () {
        console.log('');
        console.log('Examples:');
        console.log('');
        console.log('  $ echo $(soply user-svc ./deploy/charts/**/*.yaml ../configs/development/**/*.yaml)');
        console.log('    DATABASE=\'user-svc\' USERNAME=\'drmnick\'');
        console.log('');
        console.log('  $ echo $(soply -o exports user-svc ./deploy/charts/**/*.yaml ../configs/development/**/*.yaml)');
        console.log('    export DATABASE=\'user-svc\'; export USERNAME=\'drmnick\';');
    });

program.parse(process.argv);

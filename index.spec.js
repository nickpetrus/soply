const {promisify} = require('util');
const {exec} = require('child_process');
const execAsync = promisify(exec);
require('chai').should();

context('Soply as expected', () => {
    const testCases = {
        './bin/soply user-svc deploy/charts/*.yaml configs/development/*.yaml': 'Missing consumer with requested name user-svc\n',
        'env -i blah': {err: 'env: blah: No such file or directory\n'},
    };

    for (const cmd in testCases) {
        it(cmd, async () => {
            const exp = testCases[cmd];
            if (exp.err === undefined) {
                let {stdout, stderr} = await execAsync(cmd);
                stdout.should.eq(exp);
                stderr.should.eq('');
                return;
            }

            try {
                await execAsync(cmd);
            } catch ({stdout, stderr}) {
                stderr.should.be.eq(exp.err);
                stdout.should.eq('');
            }
        });
    }
});





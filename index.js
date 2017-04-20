console.time('Ghost boot');

const path = require('path');
const fs = require('fs');
const spawn = require('child_process').spawn;
const ghost = require('ghost/core');
const express = require('express');
const logging = require('ghost/core/server/logging');
const errors = require('ghost/core/server/errors');
const utils = require('ghost/core/server/utils');
const parentApp = express();
const config = require('ghost/core/server/config');

console.log('Database config: ', config.get('database:client'));

migrate().then(() => startGhost());

function migrate() {
    return new Promise(resolve => {
        const child = spawn('./node_modules/.bin/knex-migrator', ['init']);

        child.on('close', (code) => {
            resolve(code)
        });

        child.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        child.stderr.on('data', (data) => {
            console.log(`stderr: ${data}`);
        });
    });
}


function startGhost() {
    return ghost().then(function (ghostServer) {
        // Mount our Ghost instance on our desired subdirectory path if it exists.
        parentApp.use(utils.url.getSubdir(), ghostServer.rootApp);

        console.log('Starting Ghost');
        // Let Ghost handle starting our server instance.
        return ghostServer.start(parentApp).then(function afterStart() {
            console.log('Ghost boot');
            // if IPC messaging is enabled, ensure ghost sends message to parent
            // process on successful start
            if (process.send) {
                process.send({started: true});
            }
        });
    }).catch(function (err) {
        if (!errors.utils.isIgnitionError(err)) {
            err = new errors.GhostError({err: err});
        }

        if (process.send) {
            process.send({started: false, error: err.message});
        }

        logging.error(err);
        process.exit(-1);
    });
}
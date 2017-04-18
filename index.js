var ghost = require('ghost');
var KnexMigrator = require('knex-migrator');
var knexMigrator = new KnexMigrator({});

// check your database health
knexMigrator.isDatabaseOK()
    .then(function () {
        ghost().then(function (ghostServer) {
            ghostServer.start();
        });
    })
    .catch(function (err) {
        // err contains a specific code, based on that code you decide (err.code)

        // database is not initialised?
        knexMigrator.init();

        // database is not migrated?
        knexMigrator.migrate();
    });


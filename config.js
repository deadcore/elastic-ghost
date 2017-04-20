var path = require('path'), config;

config = {
    // ### Production
    // When running Ghost in the wild, use the production environment.
    // Configure your URL and mail settings here
    production: {
        url: process.env.URL,
        mail: {
            transport: 'SMTP',
            options: {
                service: process.env.SMTP_SERVICENAME,
                auth: {
                    user: process.env.SMTP_USERNAME,
                    pass: process.env.SMTP_PASSWORD
                }
            }
        },
        database: {
            client: process.env.RDS_ENGINE,
            connection: {
                host: process.env.RDS_HOSTNAME,
                user: process.env.RDS_USERNAME,
                password: process.env.RDS_PASSWORD,
                database: process.env.RDS_DB_NAME,
                port: process.env.RDS_PORT
            },
            debug: false
        },
        server: {
            host: '0.0.0.0',
            port: process.env.PORT
        },
        storage: {
            active: 'ghost-s3',
            'ghost-s3': {
                accessKeyId: process.env.IAM_ACCESS_KEY,
                secretAccessKey: process.env.IAM_SECRET_KEY,
                bucket: process.env.S3_BUCKET_NAME,
                region: process.env.S3_BUCKET_REGION
            }
        }
    }
};

exports.module = config;
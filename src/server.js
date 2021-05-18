const hapi = require('@hapi/hapi');
const routes = require('./routes');

async function init() {
    const server = hapi.server({
        host: 'localhost',
        port: 5000,
        routes: {
            cors: {
                origin: ['*']
            }
        }
    });

    server.route(routes);

    await server.start();
    console.log(`Server is running in ${server.info.uri}`);
}

init();
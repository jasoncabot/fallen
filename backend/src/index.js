const loaders = require('./loaders');
const api = require('./api');

const initialise = async () => {

    const middleware = await loaders();
    console.log(`Loading complete [${Object.keys(middleware)}]`);

    await api.inject(middleware);

    api.listen(middleware);
}

initialise()
    .then(() => {
        console.log(`Application initialised`);
    })
    .catch((e) => {
        console.error(`Failed to initialise`);
        console.error(e);
    });

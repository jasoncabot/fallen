import { initialiseMiddleware } from './loaders';
import { inject, listen } from './api';

const initialise = async () => {

    const middleware = await initialiseMiddleware();
    console.log(`Loading complete [${Object.keys(middleware)}]`);

    await inject(middleware);

    listen(middleware);
}

initialise()
    .then(() => {
        console.log(`Application initialised`);
    })
    .catch((e) => {
        console.error(`Failed to initialise`);
        console.error(e);
    });

export { initialise };
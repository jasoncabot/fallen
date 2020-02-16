import config from '../Config';
import { Authenticator } from './Authenticator';

const auth = new Authenticator();

const url = (path) => {
    return config.endpoint + path;
}

const getAndCache = (path, scene, key) => {
    scene.load.json(key, url(path), null, {
        header: 'Authorization',
        headerValue: 'Bearer ' + btoa(auth.id)
    });
};

const post = (path, data) => {
    return new Promise((resolve, reject) => {
        const headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + btoa(auth.id)
        };
        fetch(url(path), {
            method: "POST",
            headers,
            body: JSON.stringify(data)
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then(x => {
                        return reject(x.error);
                    }).catch(e => {
                        reject(e);
                    });
                } else {
                    return response;
                }
            })
            .then((response) => {
                return response.json();
            })
            .then(response => {
                resolve(response);
            })
            .catch(e => {
                reject(e);
            });
    });
}

export {
    auth, post, getAndCache
}

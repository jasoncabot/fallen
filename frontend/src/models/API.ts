import { person } from './Authenticator';

const url = (path: string) => {
    return process.env.REACT_APP_API_ENDPOINT + path;
}

const socketAuth = (callback: (auth: { token: string }) => void) => {
    return callback({
        token: btoa(person().id)
    });
}

const getAndCache = (path: string, scene: Phaser.Scene, key: string) => {
    scene.load.json(key, url(path), undefined, {
        header: 'Authorization',
        headerValue: 'Bearer ' + btoa(person().id),
        responseType: "json"
    });
};

const post = (path: string, data: any) => {
    return new Promise((resolve, reject) => {
        const headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + btoa(person().id)
        };
        fetch(url(path), {
            method: "POST",
            headers,
            body: JSON.stringify(data)
        })
            .then((response: any) => {
                if (!response.ok) {
                    return response.json().then((x: any) => {
                        return reject(x.error);
                    }).catch((e: Error) => {
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
    socketAuth, post, getAndCache
}

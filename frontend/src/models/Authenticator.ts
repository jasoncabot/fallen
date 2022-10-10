import { v4 as uuidv4 } from 'uuid';

export interface Person {
    id: string;
    name: string;
}

const storage = window.localStorage;

export const authToken = () => {
    let token = storage.getItem('token');
    if (!token) {
        token = uuidv4();
        storage.setItem('token', token);
    }
    return token;
}

export const setPerson = (person: Person) => {
    storage.setItem('person', JSON.stringify(person));
}

export const person = () => {
    return JSON.parse(storage.getItem('person') || "{}") as Person;
}

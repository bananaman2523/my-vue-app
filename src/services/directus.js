// directus/sdk version 9.12.2
// npm i @directus/sdk@9.12.2 

// import { Directus } from '@directus/sdk';
// export const directus = new Directus('http://localhost:8055');
// export const directus = new Directus('https://testtrueeye.southeastasia.cloudapp.azure.com/directus/');

// directus/sdk version ^18.0.1
// npm i @directus/sdk

import { createDirectus, rest, authentication, login } from '@directus/sdk';

class LocalStorage {
    get() {
        const data = JSON.parse(localStorage.getItem("directus-data"));
        if (!data) {
            window.location.href = '/login';
        }
        return data;
    }

    set(data) {
        localStorage.setItem("directus-data", JSON.stringify(data));
    }
}

const storage = new LocalStorage();

export const directus = createDirectus('http://localhost:8055').with(authentication('json', { storage })).with(rest());




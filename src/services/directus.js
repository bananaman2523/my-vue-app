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

export const directus = createDirectus('http://192.168.1.51:8055').with(authentication('json', { storage })).with(rest());


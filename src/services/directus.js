// directus/sdk version 9.12.2
// npm i @directus/sdk@9.12.2 

// import { Directus } from '@directus/sdk';
// export const directus = new Directus('http://localhost:8055');
// export const directus = new Directus('https://testtrueeye.southeastasia.cloudapp.azure.com/directus/');

// directus/sdk version ^18.0.1
// npm i @directus/sdk

import { createDirectus , rest } from '@directus/sdk';
export const directus = createDirectus('https://testtrueeye.southeastasia.cloudapp.azure.com/directus/').with(rest());




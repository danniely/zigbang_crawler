import fetch from 'node-fetch';
const fs = require('fs');

export const get = async (key: string): Promise<number> => {
    const db = JSON.parse(await (await fetch('db.json')).json() as string);
    return db[key];
}

export const set = async (key: string, value: number): Promise<void> => {
    const db = JSON.parse(await (await fetch('db.json')).json() as string);
    db[key] = value;
    fs.writeFile("db.json", JSON.stringify(db), (err) => {
        if (err) {
            console.log(err);
        }
    });
}
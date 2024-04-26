import {createPool} from 'mysql2/promise'

const conectionDB = {

    host: 'localhost',
    user: 'dev',
    password: 'developerBackend6969',
    database: 'hackLabs',

};

export const pool = createPool(conectionDB);
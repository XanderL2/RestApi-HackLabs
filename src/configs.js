import { config } from "dotenv";


//* Aqui leeremos la informacion de las variables de entorno, es decir, del archivo .env
config();



export const PORT = process.env.PORT || 3000;



export const DB_HOST = process.env.DB_HOST || 'localhost';
export const DB_PORT = process.env.DB_PORT || 3306;
export const DB_USER = process.env.DB_USER || 'dev';
export const DB_PASSWORD = process.env.DB_PASSWORD  || 'developerBackend6969';
export const DB_DATABASE = process.env.DB_DATABASE || 'hackLabs';
export const SECRET = process.env.SECRET;


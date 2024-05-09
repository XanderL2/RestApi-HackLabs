import { pool } from '../dbConnection.js'
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET } from "../configs.js";




const UNAUTHORIZED = {
    "Message": 'Not authorized, incorrect credentials!'
};

const USER_NOT_EXISTS = {

    "Message": "User not exists"
};

const PASSWORD_INCORRECT = {

    "Message": "User or password Incorrect!"
}; 






export const AuthUser = async (req, res) => {


    const { username, password, type } = req.body;


    if (username === undefined || password === undefined) {
        return res.status(401).json({ "Message": 'Empty username or password!' });
    }



    try {


        const userDB = await GetUserCredentials(username);
        if(userDB === false) return res.status(401).json(USER_NOT_EXISTS);


        const isEqualHash = await CompareHashes(password, userDB.passd);
        if(isEqualHash === false) return res.status(401).json(PASSWORD_INCORRECT ); 


        
        const token = jwt.sign(
            {id: userDB.id, role: "user"}, 
            SECRET, 
            {expiresIn: 60 * 60 * 5}
        );




        return res.status(202).json({
            "auth": true,
            "x-access-token": token
        });



    } catch (e) {

        console.error(e)
        return res.status(500).json(UNAUTHORIZED)
        
    }

};








export async function EncryptPassword(password) {

    try {
        
        const passwordHashed = await bcrypt.hash(password, 10);    
        return passwordHashed

    } catch (e) {

        return "Error, not hashing password" + e; 
    }

}




const ChechAuth = (req, res, next) => {


    const token = req.headers['x-access-token'];

    if (!token) {
        return res.status(401).json({ "Message": "Not authorized" });
    }


    try {


        const payload = jwt.verify(token, SECRET); 

		req.user = payload; 
		
        next(); 

    } catch (error) {

		//Cuando el token no es valido lanza una excepcion, asi que debemos usar un try - catch
        console.error(error);
        return res.status(401).json({ "Message": "Incorrect or Expired Token" });
    }

};




async function GetUserCredentials(username) {

    const [user] = await pool.query(
        'SELECT id, username, passd FROM Users WHERE username = ?',
        [username]
    );


    if(user.length <= 0) return false; 

    return user[0];

};




async function CompareHashes(passwordPlainText, hash){

    try {
        
        const isEqual = await bcrypt.compare(passwordPlainText, hash);

        return isEqual;

    } catch (error) {
        
        return "Not compare" + error;
    }
};

























/*

    *1. Crear registro /register:

        - Usar bcrypt para encriptar esas contraseñas
        

    *2. Realizar una autenticacion /signin:

    *3. Crear un token.

    *4. Crear un middleware en el que el usuario solo pueda avanzar si esta autorizado con el token



*/


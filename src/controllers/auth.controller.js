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


    const { username, password} = req.body;


    if (username === undefined || password === undefined) {
        return res.status(401).json({ "Message": 'Empty username or password!' });
    }



    try {


        const userDB = await GetUserCredentials(username);
        if(userDB === false) return res.status(401).json(USER_NOT_EXISTS);


        const isEqualHash = await CompareHashes(password, userDB.passd);
        if(isEqualHash === false) return res.status(401).json(PASSWORD_INCORRECT); 




        
        const token = jwt.sign(
            {id: userDB.id, role: userDB.role}, 
            SECRET, 
            {expiresIn: 60 * 60 * 5}
        );


        
        await pool.query("UPDATE Users SET state = true WHERE id = ?;", [userDB.id]);
        


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




export const ChechAuth = (req, res, next) => {


    const token = req.headers['x-access-token'];

    if (!token) {
        return res.status(401).json({ "Message": "Not authorized" });
    }



    try {


        const payload = jwt.verify(token, SECRET); 

		req.payload= payload; 
		
        next(); 

    } catch (error) {

        console.error(error);
        return res.status(401).json({ "Message": "Incorrect or Expired Token! Log in again" });
    }

};





export const CheckRole = (requiredRole) => (req, res, next) => {

    const role = req.payload.role;



    if(role != requiredRole){
        return res.status(401).json(UNAUTHORIZED);
    }

    next();
};






async function GetUserCredentials(username) {

    const [user] = await pool.query(
        'SELECT id, username, passd, role FROM Users WHERE username = ?',
        [username]
    );


    if(user.length <= 0) return false; 

    return user[0];

};




export async function CompareHashes(passwordPlainText, hash){

    try {
        
        const isEqual = await bcrypt.compare(passwordPlainText, hash);

        return isEqual;

    } catch (error) {
        
        return "Not compare" + error;
    }
};

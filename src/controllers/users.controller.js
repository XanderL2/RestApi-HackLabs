import { pool } from '../dbConnection.js'
import { EncryptPassword } from "./auth.controller.js";





const serverError = {
    "Message": "Internal server Error!"
};


export const GetAllUsers = async (req, res) => {


    try 
    {

        const [users] = await pool.query("SELECT id, username, age FROM Users;");

        if (users.length === 0) return res.status(404).json({ "Message": "No data!" });

        return res.json(users);

    } 
    catch (e) 
    {

        console.error(e);
        return res.status(500).json(serverError);
    }

}


export const GetUser = async (req, res) => {


    const { id } = req.params;


    try 
    {

        const isValidId = await ValidateUserId(req);
        if (isValidId != true) return res.status(400).json(isValidId);


        const [user] = await pool.query("SELECT id, username, age FROM Users WHERE id = ?", [id]);
        if (user.length === 0) return res.status(404).json({ "Message": "Empty register, id not exists" });



        return res.status(200).json(user);

    } catch (e) 
    {
        console.error(e);
        return res.status(500).json(serverError);
    }


}


export const PostUser = async (req, res) => {



    const { username, passd, age} = req.body;



    if (!(username) || !(passd) || !(age)) return res.status(400).json({ "Message": "Parameters are missing" });



    const isValidParameters = ValidateParameters(req);
    if (isValidParameters != true) return res.status(400).json(isValidParameters);



    try 
    {

        const isValidateName = await ValidateUsername(username);
        if (!(isValidateName)) return res.status(400).json({ "Message": "Invalid, username already exists" });


        const encriptedPassd = await EncryptPassword(passd)


        const responseDB = await pool.query(
            "INSERT INTO Users(username, passd, age) VALUES (?, ?, ?)", 
            [username, encriptedPassd, age]
        );



        res.status(201).json({
            "id": responseDB[0].insertId,
            "username": username,
            "passd": passd,
            "age": age
        });


    } catch (e) {

        console.error(e);
        return res.status(500).json("Database Error!");
    }

}





export const PutUser = async (req, res) => {

    const id = req.payload.id;
    const { username, passd, age } = req.body;

    if (!(username) || !(passd) || !(age)) return res.status(400).json({ "Message": "Parameters are missing" });



    const isValidParameters = ValidateParameters(req);
    if (isValidParameters != true) return res.status(400).json(isValidParameters)



    try {

        const isValidId = await ValidateUserId(undefined, id);
        if (isValidId != true) return res.status(400).json(isValidId);


        const isValidateName = await ValidateUsername(username);
        if (!(isValidateName)) return res.status(400).json({ "Message": "Invalid, username already exists" });




        const encriptedPassd = await EncryptPassword(passd)

        const dbResponse = await pool.query(
            "UPDATE Users SET username = ?, passd= ?, age = ? WHERE id = ?", 
            [username, encriptedPassd, age, id]
        );

        if (dbResponse[0].affectedRows === 0) return res.status(400).json({ "Message": "Update failed, no changes made" });



        return res.status(200).json({
            "id": id,
            "username": username,
            "passd": passd,
            "age": age

        });

    } catch (e) {

        console.log(e)
        return res.status(500).json({ "Message": "Database Error!" })

    }

}


export const PatchUsers = async (req, res) => {


    const id = req.payload.id;
    const { username, passd, age} = req.body;

    


    const isValidParameters = ValidateParameters(req);
    if (isValidParameters != true) return res.status(400).json(isValidParameters)



    try 
    {
        
        const isValidId = await ValidateUserId(undefined, id);
        if (isValidId != true) return res.status(400).json(isValidId);


        const isValidUsername = await ValidateUsername(username)
        if (isValidUsername != true) return res.status(400).json({ "Message": "Invalid, user already exists" });




        const encriptedPassd = passd === undefined ? undefined : await EncryptPassword(passd)



        const dbResponse = await pool.query(
            "UPDATE Users SET username = IFNULL(?, username), passd = IFNULL(?, passd), age = IFNULL(?, age) WHERE id = ?;", 
            [username, encriptedPassd, age, id]
        );


        if (dbResponse[0].affectedRows === 0) return res.status(400).json({ "Message": "Not update" });



        return res.status(200).json({
            "id": id,
            "username": username,
            "passd": passd,
            "age": age
        });



    } catch {


        res.status(500).json(serverError);
    }

};






export const DeleteUser = async (req, res) => {


    const id = req.payload.id;


    try {

        const isValidId = await ValidateUserId(undefined, id);
        if (isValidId != true) return res.status(400).json(isValidId);


        const results = await pool.query("DELETE FROM Users WHERE id = ?;", [id]);
        if (results[0].affectedRows == 0) return res.status(400).json({ "Message": "User not found" });


        return res.sendStatus(204);

    } catch (e) {

        console.log(e);
        return res.status(500).json(serverError);
    }
    

}






async function ValidateUsername(username) {

    const [usersDb] = await pool.query("SELECT username FROM Users WHERE username = ?", [username]);

    return usersDb.length > 0 ? false : true;

}


export async function ValidateUserId(req = undefined, idParam = undefined) {


    const id = req ? parseInt(req.params.id): idParam;



    if(id === undefined) return { "Message": "Not user id or incorrect" };

    if (isNaN(id)) return { "Message": "Incorrect Type of user Id" };



    const [results] = await pool.query("SELECT id FROM Users WHERE id = ?", [id]);


    return results.length <= 0 ? { "Message": "User Id does not exist" } : true;

}



function ValidateParameters(req) {

    const { username, passd, age } = req.body;


    const regularExpression = /^[a-zA-Z0-9_-]+$/;

    if(username != undefined )
    

    if( username === undefined || !(regularExpression.test(username)) || username.length <= 6 || username.length >= 100){

        return {"Message": "Username does not meet the requirements"};
    } 


    if ( age !== undefined && (isNaN(parseInt(age)))){
        return { "Message": "Invalid age type" };
    }


    if (age <= 14 || age > 130) return { "Message": "Invalid Age" };


    return passd !== undefined && passd.length <= 8 ? { "Message": "Very short password" } : true;

}


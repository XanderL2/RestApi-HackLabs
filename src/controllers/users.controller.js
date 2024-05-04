import { pool } from '../dbConnection.js'


const serverError = {
    "Message": "Internal server Error!"
};


export const GetAllUsers = async (req, res) => {


    try 
    {

        const [users] = await pool.query("SELECT * FROM Users;");

        if (users.length === 0) return res.json({ "Message": "No data!" });

        return res.json(users);

    } 
    catch (e) 
    {

        console.error(e);
        return res.status(500).json(serverError);
    }

}


export const GetUser = async (req, res) => {


    const { id } = req.params


    try 
    {

        const isValidId = await ValidateID(req);
        if (isValidId != true) return res.status(400).json(isValidId);


        const [user] = await pool.query("SELECT * FROM Users WHERE id = ?", [id]);
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


        const responseDB = await pool.query(
            "INSERT INTO Users(username, passd, age) VALUES (?, ?, ?)", 
            [username, passd, age]
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

    const { id } = req.params;
    const { username, passd, age } = req.body;

    if (!(username) || !(passd) || !(age)) return res.status(400).json({ "Message": "Parameters are missing" });



    const isValidParameters = ValidateParameters(req);
    if (isValidParameters != true) return res.status(400).json(isValidParameters)



    try {

        const isValidId = await ValidateID(req);
        if (isValidId != true) return res.status(400).json(isValidId);


        const isValidateName = await ValidateUsername(username);
        if (!(isValidateName)) return res.status(400).json({ "Message": "Invalid, username already exists" });


        const dbResponse = await pool.query(
            "UPDATE Users SET username = ?, passd= ?, age = ? WHERE id = ?", 
            [username, passd, age, id]
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


    const { id } = req.params;
    const { username, passd, age} = req.body;



    const isValidParameters = ValidateParameters(req);
    if (isValidParameters != true) return res.status(400).json(isValidParameters)




    try 
    {
        
        const isValidId = await ValidateID(req);
        if (isValidId != true) return res.status(400).json(isValidId);


        const isValidUsername = await ValidateUsername(username)
        if (isValidUsername != true) return res.status(400).json({ "Message": "Invalid, user already exists" });



        const dbResponse = await pool.query(
            "UPDATE Users SET username = IFNULL(?, username), passd = IFNULL(?, passd), age = IFNULL(?, age) WHERE id = ?;", 
            [username, passd, age, id]
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


    const { id } = req.params


    try {

        const isValidId = await ValidateID(req);
        if (isValidId != true) return res.status(400).json(isValidId);


        const results = await pool.query("DELETE FROM Users WHERE ID = ?", [id]);
        if (results[0].affectedRows == 0) return res.status(400).json({ "Message": "User not found" });


        return res.sendStatus(204);

    } catch (e) {

        console.log(e);
        return res.status(500).json(serverError);

    }

}



async function ValidateID(req) {


    const id = parseInt(req.params.id);

    if (!(id)) return { "Message": "Not id, incorrect" };

    if (typeof(id) != 'number') return { "Message": "Incorrect Type of id" };

    const usersId = await GetIds();

    if(!usersId.includes(id)) return { "Message": "Id does not exist" };


    return true;

}


function ValidateParameters(req) {

    const { passd, age } = req.body;


    if(age){

        if (!(typeof (age) === 'number')) return { "Message": "Invalid age type" };
    }

    if (age <= 14 || age > 130) return { "Message": "Invalid Age" };

    if (passd.length <= 8) return { "Message": "Very short password" }


    return true;
}



async function ValidateUsername(username) {

    const usersDb = await pool.query("SELECT username FROM Users");

    for (const user of usersDb[0]) {

        if (user.username == username) return false;
    }

    return true;

}


async function GetIds() {


    try {

        const [ids] = await pool.query("SELECT id FROM Users;");

        let listIds = [];


        for (const item of ids) {
            
            listIds.push(item.id);
        }
       
        return listIds;

    } catch (e) {

        return e;
    }

}

import { pool } from '../dbConnection.js'


/*

    viernes 12
    *GetAllUsers;
    *Get Users;

    !Get Users;
    *Get Users;

*/

export const GetAllUsers = async (req, res) => {

    let results;

    try {

        results = await pool.query("SELECT * FROM Users;");  

    } catch (e) {

        console.log(e);
        return res.status(500).json({"Message": "Database Error!"});
    }

    return res.send(results[0])
}


export const GetUser = async (req, res) => {


    const {id} = req.params
     
    const isValidId = await ValidateID(req);



    try{


        if(isValidId != true) return res.status(400).json(isValidId);

        const results = await pool.query("SELECT * FROM Users WHERE id = ?", [id]);



        if(results[0].length === 0) return res.status(400).json({"Message": "Empty register, id not exists"})

        return res.status(200).json(results[0]);


    }catch(e){

        console.log(e)
        res.status(500).json({"Message": "Database Error!"})
    }


}


export const PostUser = async (req, res) => {


    const { username, passd, age } = req.body;
    const isValidParameters = ValidateParameters(req);


    if(isValidParameters != true) return res.status(400).json(isValidParameters);



    try {

        const isValidateName = await ValidateUsername(username);

        if(!(isValidateName)) return res.status(400).json({ "message": "Invalid, user already exists" });



        const responseDB = await pool.query("INSERT INTO Users(username, passd, age) VALUES (?, ?, ?)", [username, passd, age]);

        res.status(201).json({
            "id": responseDB[0].insertId,
            "username": username,
            "passd": passd,
            "age": age
        });


    } catch (e) {

        console.log(e);
        return res.status(500).json("Database Error!");
    }


}

export const PutUser = async (req, res) => {

    return res.send("Put User")
}


export const DeleteUser = async (req, res) => {


    const {id} = req.params
     
    const isValidId = await ValidateID(req);




    try{


        if(isValidId != true) return res.status(400).json(isValidId);

        const results = await pool.query("DELETE FROM Users WHERE ID = ?", [id]);

        if(results[0].affectedRows == 0) return res.status(400).json({"Message": "Empty Register"})



        return res.status(200).json(results[0]);

    }catch(e){

        console.log(e);
        res.status(500).json({"Message": "Database Error!"})

    }

}



async function ValidateID(req){


    const id = parseInt(req.params.id);

    if(!(id)) return {"Message": "Not id, incorrect"};

    if(typeof(age) === 'number') return {"Message": "Incorrect Type of id"};

    const quantity = await CountUsers();

    if(id <= 0 || id > quantity) return {"Message": "Id does not exist"}
    

    return true;


}


function ValidateParameters(req){

    const { username, passd, age } = req.body;

    if (!(username) || !(passd) || !(age)) return {"Message": "Invalid Parameter"}; 

    if(!(age) || !(typeof(age) === 'number')) return {"Message": "Invalid type of age"}; 

    if (age <= 14 || age > 130) return {"Message": "Invalid Age"};



    return true;
}


async function ValidateUsername(username) {

    const usersDb = await pool.query("SELECT username FROM Users");

    for (const user of usersDb[0]) {

        if (user.username === username) return false;
    }

    return true;

}


async function CountUsers() {

    let quantity
    
    try{

        quantity = await pool.query("SELECT COUNT(*) AS registersQuantity FROM Users;");
        quantity = quantity[0][0].registersQuantity

    }catch(e){

        return e;
    }

    return quantity; 
}

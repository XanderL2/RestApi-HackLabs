import { pool } from '../dbConnection.js'

export const GetUser = async (req, res) => {

    let results;

    try {

        results = await pool.query("SELECT * FROM Users;"); //Retorna un objeto

    } catch (e) {

        return res.json(e)
    }

    return res.send(results[0])
}


export const PostUser = async (req, res) => {

    const { username, passd, age } = req.body;

    if (!(username) || !(passd) || !(age)) return res.status(400).json({ "message": "Values Not found" });

    if (passd <= 0 || passd > 130) return res.status(400).json({ "message": "Age Invalid" });


    try {

        const isValidateName = await ValidateUsername(username)

        if(!(await isValidateName)) return res.status(400).json({ "message": "Age Invalid" });

        const responseDB = await pool.query("INSERT INTO Users(username, passd, age) VALUES (?, ?, ?)", [username, passd, age]);

        res.status(201).json({
            "id": responseDB[0].insertId,
            "username": username,
            "passd": passd,
            "age": age
        });


    } catch (e) {

        return res.send("Database Error!" + e);
    }
}

export const PutUser = async (req, res) => {

    return res.send("Put User")
}



export const DeleteUser = async (req, res) => {

    return res.send("Delete user")
}



async function ValidateUsername(username) {

    const usersDb = await pool.query("SELECT username FROM Users");

    console.log(usersDb)
    for (const user of usersDb[0]) {

        if (user.username === username) return false;
    }

    return true;

}

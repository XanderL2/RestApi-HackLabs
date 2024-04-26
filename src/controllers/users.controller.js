import {pool} from '../dbConnection.js'

export const getUser = async (req, res) => {

    let results;

    try{

        results = await pool.query("SELECT * FROM Users;"); //Retorna un objeto

    }catch(e){

        return res.json(e)

    }

    return res.send(results[0])
}
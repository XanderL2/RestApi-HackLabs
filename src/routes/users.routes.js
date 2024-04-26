import {Router} from "express";
import {pool} from '../dbConnection.js'

const router = Router();


router.get('/users', async (req, res) => {

    let results;
    try{

        results = await pool.query("SELECT * FROM Users;"); //Retorna un objeto

    }catch(e){

        return res.json(e)

    }



    return res.send(results[0])

    

});







export default router


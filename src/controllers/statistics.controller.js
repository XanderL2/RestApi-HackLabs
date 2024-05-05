import { pool } from '../dbConnection.js'

import { ValidateUserId } from "./users.controller.js";
// import { ValidateToolId } from "./tools.controller.js";


const serverError = {
    "Message": "Internal server error"
};


export const GetStatistics= async (req, res) => {
   

    if(req.query.page){

        const page = parseInt(req.query.page);


        if(isNaN(page) || page <= 0) return res.status(400).json({"Message": "Invalid Query!"});

        const results = await PaginationQuery(page, 5);

        if(results.length <= 0) return res.status(404).json({"Message": "No data!"});            

        return res.json(results);
    } 


    try {
        
        const [results] = await pool.query("SELECT * FROM Loggin");

        if(results.length <= 0) return res.status(404).json({"Message": "No data!"});

        return res.status(200).json(results);

    } catch (e) {
        
        console.error(e);
        return res.status(500).json(serverError);
    }

};


export const GetStatisticsPerUser = async (req, res) => {



    const isValidUserId = await ValidateUserId(req);
    if(isValidUserId != true) return res.status(400).json(isValidUserId);


    try {
        
        const [results] = await pool.query(
            "SELECT * FROM Loggin WHERE userId = ?",
            [req.params.id]
        );

        if(results.length <= 0) return res.status(404).json({"Message": "The id does not have statistics!"});

        return res.status(200).json(results);

    } catch (e) {
    
        console.error(e);
        return res.status(500).json(serverError);
    }
}


export const PostStatistic = async (req, res) => {

    const {id} = req.params;

    console.log(id)

    try {


        const isValidUserId = await ValidateUserId(req);
        if(isValidUserId != true) return res.status(400).json(isValidUserId);


        const [results] = await pool.query(
            "INSERT INTO Loggin (userId, toolId) VALUES (?, 1)",
            [id]
        );

        if(results.length <= 0) return res.status(404).json({"Message": "Could not create statistics"});

        return res.status(201).json({

            "id": results.insertId,
            "userId": id,
            "machine": 0,
            "attempt": 0,
            "loss": 0
        });

    } catch (e) {
        
        console.error(e);
        return res.status(500).json(serverError);
    }


}


export const PatchStatistic = async (req, res) => {

    const {id, userId, machine, attempt, loss, toolId} = req.body;     

    return res.send("Patch");
}



export const DeleteStatistic= async (req, res) => {



    return res.send("Delete");
}












function CalculateOffset(page, limit){

    page = page === 1 ? page = 0 : page - 1;

    const offset = page * limit;

    return offset;
}



async function PaginationQuery(page, limit = 20){

    try {
        
        const offset = CalculateOffset(page, limit);

        const [results] = await pool.query(
            "SELECT * FROM Loggin LIMIT ? OFFSET ?", 
            [limit, offset]
        );


        return results       

    } catch (e) {
        
        console.error(e);
        return serverError;
    }    

}




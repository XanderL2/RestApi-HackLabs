import { pool } from '../dbConnection.js'

import { ValidateUserId } from "./users.controller.js";
import { ValidateToolId } from "./tools.controller.js";


const serverError = {
    "Message": "Internal server error"
};


export const GetStatistics = async (req, res) => {


    if (req.query.page) {

        const page = parseInt(req.query.page);


        if (isNaN(page) || page <= 0) return res.status(400).json({ "Message": "Invalid Query!" });

        const results = await PaginationQuery(page, 5);

        if (results.length <= 0) return res.status(404).json({ "Message": "No data!" });

        return res.json(results);
    }


    try {

        const [results] = await pool.query("SELECT * FROM Loggin");

        if (results.length <= 0) return res.status(404).json({ "Message": "No data!" });

        return res.status(200).json(results);

    } catch (e) {

        console.error(e);
        return res.status(500).json(serverError);
    }

};


export const GetStatisticsPerUser = async (req, res) => {



    const isValidUserId = await ValidateUserId(req);
    if (isValidUserId != true) return res.status(400).json(isValidUserId);


    try {

        const [results] = await pool.query(
            "SELECT * FROM Loggin WHERE userId = ?",
            [req.params.id]
        );

        if (results.length <= 0) return res.status(404).json({ "Message": "The id does not have statistics!" });

        return res.status(200).json(results);

    } catch (e) {

        console.error(e);
        return res.status(500).json(serverError);
    }
}


export const PostStatistic = async (req, res) => {

    const { id } = req.params;

    console.log(id)

    try {


        const isValidUserId = await ValidateUserId(req);
        if (isValidUserId != true) return res.status(400).json(isValidUserId);


        const [results] = await pool.query(
            "INSERT INTO Loggin (userId, toolId) VALUES (?, 1)",
            [id]
        );

        if (results.length <= 0) return res.status(404).json({ "Message": "Could not create statistics" });

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

    const { id, userId, machine, attempt, loss, toolId } = req.body;


    const isValidParameters = ValidateParameters(req);

    if (isValidParameters != true) return res.status(400).json(isValidParameters);



    try {


        const isValidStatisticId = await ValidateStatisticId(id);
        if (isValidStatisticId != true) return res.status(400).json(isValidStatisticId);


        const isValidUserId = await ValidateUserId(undefined, userId);
        if (isValidUserId != true) return res.status(400).json(isValidUserId);

    
        const isValidToolId = await ValidateToolId(toolId);
        if (toolId !== undefined && (isValidToolId != true)) return res.status(400).json(isValidToolId);



        const [results] = await pool.query(
            "UPDATE Loggin SET machine = IFNULL(?, machine), attempt = IFNULL(?, attempt), loss = IFNULL(?,loss), toolId = IFNULL(?, toolId) WHERE id = ?;",
            [machine, attempt, loss, toolId, id]
        );

        if(results.affectedRows <= 0) return res.status("Update failed, no changes made");

        return res.status(200).json(results);

    } catch (e) {

        console.error(e);
        return res.status(500).json(serverError);
    }
}



export const DeleteStatistic = async (req, res) => {



    return res.send("Delete");
}


function ValidateParameters(req) {

    const { id, userId, machine, attempt, loss, toolId } = req.body;

    if (!id || !userId) {
        return { "Message": "The id and userId fields are required" };
    }

    if (isNaN(parseInt(toolId))) {
        return { "Message": "Incorrect Tool Id Data Type!" };
    }

    if (isNaN(parseInt(id))) {
        return { "Message": "Incorrect Statistic Id Data Type!" };
    }

    if (machine !== undefined && (isNaN(parseInt(machine)) || machine < 0)) {
        return { "Message": "Invalid number of machines!" };
    }

    if (attempt !== undefined && (isNaN(parseInt(attempt)) || attempt < 0)) {
        return { "Message": "Invalid number of attempts!" };
    }

    if (loss !== undefined && (isNaN(parseInt(loss)) || loss < 0)) {
        return { "Message": "Invalid number of losses!" };
    }



    return true;

}


async function ValidateStatisticId(id) {

    try {

        let listIds = [];

        const [ids] = await pool.query("SELECT id FROM Loggin");


        for (const item of ids) {
            listIds.push(item.id);
        }

        if (!listIds.includes(id)) return { "Messsage": "Statistic Id does not exists" };


        return true;

    } catch (e) {

        console.error(e);
        return { serverError }
    }



}








function CalculateOffset(page, limit) {

    page = page === 1 ? page = 0 : page - 1;

    const offset = page * limit;

    return offset;
}



async function PaginationQuery(page, limit = 20) {

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




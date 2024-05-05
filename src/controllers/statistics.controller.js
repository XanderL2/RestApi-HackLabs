import { pool } from '../dbConnection.js'


const serverError = {
    "Message": "Internal server error"
};


export const GetStatistics= async (req, res) => {
   
    const page = parseInt(req.query.page);



    if(isNaN(page) || page <= 0) return res.status(400).json({"Message": "Invalid Query!"});

    if(page){

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

    return res.send("Get individual")
}


export const PostStatistic = async (req, res) => {

    return res.send("Post");
}


export const PatchStatistic = async (req, res) => {


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
            "SELECT * FROM Tools LIMIT ? OFFSET ?", 
            [limit, offset]
        );


        return results       

    } catch (e) {
        
        console.error(e);
        return serverError;
    }    

}




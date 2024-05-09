import { pool } from '../dbConnection.js'



const serverError = {
    "Message": "Internal Server Error!"
}


export const GetAllTools = async (req, res) => {


    try
    {

        const [results] = await pool.query("SELECT * FROM Tools");
        
        if(results.length <= 0) return res.status(404).json({"Message": "No data!"})

        return res.status(200).json(results);

    }catch(e){

        console.error("Error: " + e);
        return res.status(500).json(serverError); 
    }


};


export const GetTool = async (req, res) => {

    const id = parseInt(req.params.id);


    if(isNaN(id)) return res.status(400).json({"Message": "Invalid ID data type!"});


    try {

        const isValidId = await ValidateToolId(id);
        if(isValidId != true) return res.status(404).json(isValidId);


        const [result] = await pool.query('SELECT * FROM Tools WHERE id = ?', [id])
        if(result.length <= 0) return res.status(404).json({"Message": "Empty Register"})

        

        return res.status(200).json(result);

    } catch (e) {
    
        console.error(e);
        return res.status(500).json(serverError);
    }

};







export const PostTool = async (req, res) => {

    const {name, description} = req.body;


    if(!(name) || !(description)) return res.status(404).json({"Message": "The required parameters were not found."});



    const isValidParams = ValidateParams(req);
    if(isValidParams != true) return res.status(400).json(isValidParams);


    try {

        const isValidateName = await ValidateName(name);
        if(isValidateName != true) return res.status(400).json({"Message": "Tool already exists"});

        
        const [results] = await pool.query(
            "INSERT INTO Tools(name, description) VALUES (?,?)", 
            [name, description]
        );

        
        return res.status(201).json({

            "Id": results.insertId,
            "Name": name,
            "Description": description
        });


    } catch (e) {
        
        console.error(e);
        return res.status(500).json(serverError);
    }


};





export const PutTool= async (req, res) => {


    const id = parseInt(req.params.id);
    const {name, description} = req.body;


    if(!(id) || !(name) || !(description)){
        return res.status(400).json({"Message": "The required parameters were not found."});
    } 


    if(isNaN(id)) return res.status(400).json({"Message": "Incorrect id Data Type!"});


    const isValidParams = ValidateParams(req);
    if(isValidParams != true) return res.status(404).json(isValidParams);



    try {
    
        const isValidId = await ValidateToolId(id);
        if(isValidId != true) return res.status(400).json(isValidId);

    
        const isValidateName = await ValidateName(name);
        if(isValidateName != true) return res.status(400).json({"Message": "Name already exists"}); 


        const [results] = await pool.query(
            "UPDATE Tools SET name = ?, description = ? WHERE id = ?",
            [name, description, id]
        );

        if(results.affectedRows <= 0) return res.status(400).json({"Message": "Update failed, no changes made"});

        return res.status(200).json({
            "id": id,
            "name": name,
            "description": description
        });

    } catch (e) {

        console.error(e);
        return res.status(500).json(serverError);
    }

};

export const PatchTool = async (req, res) => {

    const id = parseInt(req.params.id);
    const {name, description} = req.body;


    if(isNaN(id)) return res.status(400).json({"Message": "Incorrect id Data Type!"});

    const isValidParams = ValidateParams(req);
    if(isValidParams != true) return res.status(404).json(isValidParams);


    try {

        const isValidId = await ValidateToolId(id);
        if(isValidId != true) return res.status(400).json(isValidId);

    
        const isValidateName = await ValidateName(name);
        if(isValidateName != true) return res.status(400).json({"Message": "Name already exists"}); 

        const [results] = await pool.query(
            "UPDATE Tools SET name = IFNULL(?, name), description = IFNULL(?, description) WHERE id = ?;", 
            [name, description, id]
        );

        if(results.affectedRows <= 0) return res.status(400).json({"Message": "Update failed, no changes made"});

        return res.status(200).json({
            "id": id,
            "name": name,
            "description": description,
        });

      

    } catch (e) {

        console.error(e);
        return res.status(500).json(serverError);

    }

};

export const DeleteTool = async (req, res) => {

    const id = parseInt(req.params.id);

    if(isNaN(id)) return res.status(400).json({"Message": "Incorrect id Data Type!"});


    try {
        
        const isValidId = await ValidateToolId(id);
        if(isValidId != true) return res.status(404).json(isValidId);

        
        const [results] = await pool.query("DELETE FROM Tools WHERE id = ?;", [id]);



        if (results.affectedRows == 0) return res.status(400).json({ "Message": "Tool not found" });


        return res.sendStatus(204);


    } catch (e) {
    
        console.error(e);
        return res.status(500).json(serverError);
    }




};



function ValidateParams(req) {

    const {name, description} = req.body;


    const regularExpression = /^[a-zA-Z0-9_-]+$/;


    if( name !== undefined && (!(regularExpression.test(name)) || name.length > 30)) {
            
        return {"Message": "The name does not meet the requirements"};

    }


    if( description !== undefined &&(description.length > 255 || description.length < 50)){

        return {"Message": "The description must be between 50 and 255 characters"};
    } 


    return true; 
}


async function ValidateName (name){

    const [result] = await pool.query("SELECT name FROM Tools WHERE id = ?", [name]);

    return result.length > 0 ? false : true;
}

export async function ValidateToolId(id){


    const [results] = await pool.query("SELECT id FROM Tools WHERE id = ?", [id]);

    return results.length <= 0 ? {"Messsage": "Tool Id does not exists"} : true
}

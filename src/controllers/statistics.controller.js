import {Router} from "express";
import { GetAllTools,  GetTool, PostTool, PutTool, PatchTool, DeleteTool} from "../controllers/tools.controller.js";




const router = Router();




/* Rutas de Obtencion de informacion */
router.get('/tools', GetAllTools);
router.get('/tools/:id', GetTool);


/* Rutas de insercion de informacion */
router.post('/tools', PostTool);



/* Rutas de edicion de informacion */
router.put('/tools/:id', PutTool); 
router.patch('/tools/:id/', PatchTool);  


/* Rutas de eliminacion de informacion */
router.delete('/tools/:id', DeleteTool);







export default router


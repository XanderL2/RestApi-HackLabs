import {Router} from "express";
import { GetAllTools,  GetTool, PostTool, PutTool, PatchTool, DeleteTool} from "../controllers/tools.controller.js";

import { ChechAuth, CheckRole } from "../controllers/auth.controller.js";



const router = Router();





//* Rutas Publicas
router.get('/tools', GetAllTools);
router.get('/tools/:id', GetTool);




//! Rutas Privadas 
router.post('/tools', ChechAuth, CheckRole('admin'), PostTool);
router.put('/tools/:id', ChechAuth, CheckRole('admin'), PutTool); 
router.patch('/tools/:id/', ChechAuth, CheckRole('admin'), PatchTool);  
router.delete('/tools/:id', ChechAuth, CheckRole('admin'), DeleteTool);







export default router

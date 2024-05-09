import {Router} from "express";
import { GetAllUsers, GetUser, PostUser, PutUser, DeleteUser, PatchUsers} from "../controllers/users.controller.js";
import { ChechAuth, CheckRole } from "../controllers/auth.controller.js";




const router = Router();




//*Rutas Publicas
router.get('/users', GetAllUsers);
router.get('/users/:id', GetUser);
router.post('/register', PostUser);




//!Rutas Privadas 
router.put('/users/', ChechAuth, CheckRole('user'),  PutUser); 
router.patch('/users/', ChechAuth, CheckRole('user'), PatchUsers);  
router.delete('/users/', ChechAuth, CheckRole('user'), DeleteUser);









export default router


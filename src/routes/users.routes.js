import {Router} from "express";
import { GetAllUsers, GetUser, PostUser, PutUser, DeleteUser, PatchUsers} from "../controllers/users.controller.js";


const router = Router();




/* Rutas de Obtencion de informacion */
router.get('/users', GetAllUsers);
router.get('/users/:id', GetUser);


/* Rutas de insercion de informacion */
router.post('/users', PostUser);



/* Rutas de edicion de informacion */
router.put('/users/:id', PutUser); 
router.patch('/users/:id/', PatchUsers);  


/* Rutas de eliminacion de informacion */
router.delete('/users/:id', DeleteUser);







export default router


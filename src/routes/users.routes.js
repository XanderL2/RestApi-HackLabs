import {Router} from "express";
import { GetAllUsers, GetUser, PostUser, PutUser, DeleteUser, PatchUsers} from "../controllers/users.controller.js";
import { ChechAuth } from "../controllers/auth.controller.js";




const router = Router();




//*Rutas Publicas
router.get('/users', GetAllUsers);
router.get('/users/:id', GetUser);


router.post('/register', PostUser);




//!Rutas Privadas 
router.put('/users/', ChechAuth, PutUser); 
router.patch('/users/', ChechAuth, PatchUsers);  

router.delete('/users/', ChechAuth, DeleteUser);




// /* Rutas de edicion de informacion */
// router.put('/users/:id', PutUser); 
// router.patch('/users/:id', PatchUsers);  


// /* Rutas de eliminacion de informacion */
// router.delete('/users/:id', DeleteUser);







export default router


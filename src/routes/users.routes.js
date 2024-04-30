import {Router} from "express";
import { GetAllUsers, GetUser, PostUser, PutUser, DeleteUser} from "../controllers/users.controller.js";


const router = Router();



router.get('/users', GetAllUsers);
router.get('/users/:id', GetUser);


router.post('/users', PostUser);
router.put('/users', PutUser);


router.delete('/users/:id', DeleteUser);







export default router


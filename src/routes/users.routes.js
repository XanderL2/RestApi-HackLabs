import {Router} from "express";
import { GetUser, PostUser, PutUser, DeleteUser} from "../controllers/users.controller.js";


const router = Router();


router.get('/users', GetUser);
router.post('/users', PostUser);
router.put('/users', PutUser);
router.delete('/users', DeleteUser);







export default router


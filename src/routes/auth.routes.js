import {Router} from "express";
import { AuthUser } from "../controllers/auth.controller.js";




const router = Router();


//*Publicas
router.post('/login/', AuthUser);  










export default router

import {Router} from "express";
import { GetStatistics, GetStatisticsPerUser, PostStatistic, PatchStatistic, DeleteStatistic} from "../controllers/statistics.controller.js";

import { ChechAuth, CheckRole } from "../controllers/auth.controller.js";


const router = Router();




//* Publicas
router.get('/statistics', GetStatistics); 
router.get('/statistics/:id', GetStatisticsPerUser); 




//! Privadas
router.post('/statistics/:id', ChechAuth, CheckRole('user'), PostStatistic);  

router.patch('/statistics/', ChechAuth, CheckRole('admin'), PatchStatistic);  
router.delete('/statistics/:id', ChechAuth, CheckRole('admin'), DeleteStatistic); 







export default router
import {Router} from "express";
import { GetStatistics, GetStatisticsPerUser, PostStatistic, PatchStatistic, DeleteStatistic} from "../controllers/statistics.controller.js";



const router = Router();




/* Rutas de Obtencion de informacion */
router.get('/statistics', GetStatistics); //Visualizar estadisticas generales  con query params
router.get('/statistics/:id', GetStatisticsPerUser); //Visualizar estadisticas de un id en concreto



/* Rutas de insercion de informacion */
router.post('/statistics/:id', PostStatistic);  //Crean nuevo registro  con id



/* Rutas de edicion de informacion */
router.patch('/statistics/', PatchStatistic);  //Actualizar parte de un registro, es decir de manera parcial


/* Rutas de eliminacion de informacion */
router.delete('/statistics/:id', DeleteStatistic); //Borrar un registro







export default router
import express from 'express';

import usersRoutes from "./routes/users.routes.js";
import toolsRoutes from "./routes/tools.routes.js";
import statisticsRoutes from "./routes/statistics.routes.js";

import { PORT } from "./configs.js";

const app = express();
app.use(express.json());



app.use('/api/',usersRoutes);
app.use('/api/', toolsRoutes);
app.use('/api/', statisticsRoutes);


app.use((req, res, next) => {


    return res.status(404).json(
        {"Message": "Endpoint not found"}
    );

});



app.listen(PORT);
console.log("Server running on port " + PORT);

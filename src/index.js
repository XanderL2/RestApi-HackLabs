import express from 'express';

import usersRoutes from "./routes/users.routes.js";
import toolsRoutes from "./routes/tools.routes.js";
import statisticsRoutes from "./routes/statistics.routes.js";



const app = express();
app.use(express.json());



app.get('/', (req, res) => {

    res.send("Index")

});


app.use('/api/',usersRoutes);
app.use('/api/', toolsRoutes);
app.use('/api/', statisticsRoutes);


app.listen(3000);

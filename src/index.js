import express from 'express';
import usersRoutes from "./routes/users.routes.js";

const app = express();
app.use(express.json());


app.get('/', (req, res) => {

    res.send("Index")

});

app.use('/api/',usersRoutes);



app.listen(3000);

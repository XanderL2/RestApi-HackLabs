import express from 'express';

const app = express();

app.get('/users', (req, res) => {

    res.send("Employees")

});




app.listen(3000);

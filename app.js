require('dotenv').config();
const express = require('express');
const app = express();
const apiRouter = require('./routers/apiRouter');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.use("/api/v1", apiRouter);




const PORT = process.env.PORT;



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
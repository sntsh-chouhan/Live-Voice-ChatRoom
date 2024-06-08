require('dotenv').config();
const express = require('express');
const app = express();
const DbConnect = require('./database')
const router = require('./routes');

const PORT = process.env.PORT || 5500;
DbConnect();
app.use(express.json());
app.use(router);

app.get('/', (req, res)=>{
    res.send('hi');
});



app.listen(PORT, ()=> console.log(`listening on port ${PORT}`));
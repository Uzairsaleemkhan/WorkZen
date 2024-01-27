const express = require("express");
const cors = require("cors");


const app= express();
app.get('/',(req,res)=>{
    res.send("Just testing!!!");
})
app.listen(3000,()=>{
    console.log("App is listening on port 3000");
})
const express = require("express");
const router = express.Router();

//testing the server so everyting's working
router.get('/testing',(req,res)=>{
    res.send('Just testing it!')
});

module.exports = router;
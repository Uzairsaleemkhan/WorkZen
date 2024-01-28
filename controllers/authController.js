const knex = require("knex");
const pg = require("pg");
const authController = {

    validateUser: function(username,email,password){
        //validating username
       if(typeof username!=='string'||username.length<5||username.length>100||username.split('').reduce((acc,char)=> char!==' '?acc+=char:acc,'').length===0){
        return false;
      }
      // validating email
      else if(typeof email!=='string'||!email.includes('@')||email.length<5||email.length>100||email.split('').reduce((acc,char)=> char!==' '?acc+=char:acc,'').length===0){
        return false;
      }
     // validating password
      else if(typeof password!=='string'||password.length<5||password.length>100||password.split('').reduce((acc,char)=> char!==' '?acc+=char:acc,'').length===0){
        return false;
      }
    // if everything is correct returning true
      else{
        return true;
      }

    },
    register:function(req,res,next){
        const{username,email,password} =req.body;
        // validating user
       const isValid = authController.validateUser(username,email,password);
       if(isValid){
        // if valid sending data to postgres
        return res.status(201).json("Correct Created user!")

       }
       else{
        return res.status(400).json('invalid');
       }
       


    },
    login(req,res,next){

    }
    ,
    logout(req,res,next){

    }

};

module.exports = authController;
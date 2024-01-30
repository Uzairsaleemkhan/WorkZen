const knex = require('knex')({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'postgres',
      password : 'test',
      database : 'workzen'
    }
  });
const bcrypt = require("bcrypt");
const projectController={

   createProject(req,res,next){
        const{email,title,description}= req.body;
        knex.select('*').from('users').where({email}).first()
        .then(user=>{
            if(user.role==='team member'){
                throw new Error('unauthorized')
            }
        })
   }


}
//      ---------------projects schema--------------
//projects       ----id-----email----------status--------title--------description--------
//projectmembers ----id-----projectid------email------
//projectrole    ----id-----role-----------projectid-----email





module.exports = projectController;
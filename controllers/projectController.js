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
        const{email,title,description,membersArray}= req.body;
        knex.transaction(trx=>{



            return trx('projects')
           .insert({email,title,description})
           .returning('*')
           .first()



           .then(project=>{
                return trx('projectrole')
                .insert({role:'project member',projectid:project.id,email})
                .returning('*')
                .first()
            })



           .then(projectrole=>{
               return trx('projectmembers')
               .insert({projectid:projectrole.projectid,email})
               .returning('*')
               .first()            
            })


            .then(projectmember=>{
                
                knex.select('*')
                .from('users')
                .whereIn('email',membersArray)
                .then(users=>{
                    users.forEach((user)=>{
                        
                    })
                })
            })


           .then(trx.commit)
           .catch(trx.rollback)
        })
       .then(result=>{
            console.log('result transaction success')

        })
       
   }


}
//      ---------------projects schema--------------
//projects       ----id-----email----------status--------title--------description-------
//projectmembers ----id-----projectid------email------
//projectrole    ----id-----role-----------projectid-----email





module.exports = projectController;
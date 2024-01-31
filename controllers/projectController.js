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
        // starting the transaction for project data submission
        knex.transaction(trx=>{
            //inserting the actual project into db
            const projectData ={email,title,description};
            return trx('projects').insert(projectData).returning('*')

           .then(project=>{
                const projectRole = {role:'project manager',projectid:project[0].id,email};
                return trx('projectrole').insert(projectRole).returning('*')
            })


           .then(projectrole=>{
                const projectMember = {projectid:projectrole[0].projectid,email}
               return trx('projectmembers').insert(projectMember).returning('*')
            })


            .then(projectMember=>{
                const projectId = projectMember[0].projectid;
                return  knex.select('*').from('users').whereIn('email',membersArray)
                .then(users=>{
                   const usersPromise = users.map((user)=>{
                        const teamMember ={projectid:projectId,email:user.email}
                        return trx('projectmembers').insert(teamMember).returning('*')
                        .then((member)=>{
                            const teamRole ={projectid:projectId,email:user.email}
                            return trx('projectrole').insert(teamRole).returning('*')
                        })
                        .catch((err)=>{
                            throw err;
                        })

                    })
                   return Promise.all(usersPromise)
                })
                .catch(err=>{
                    throw err
                })
            })
           .then(trx.commit)
           .catch(trx.rollback)
        })
       .then(result=>{
            res.status(200).json('created project')
        })
        .catch(err=>{
            console.log("ERROR :",err)
            res.status(400).json('transaction error')
        })
       
   }


}
//      ---------------projects schema--------------
//projects       ----id-----email----------status--------title--------description-------
//projectmembers ----id-----projectid------email------
//projectrole    ----id-----role-----------projectid-----email





module.exports = projectController;
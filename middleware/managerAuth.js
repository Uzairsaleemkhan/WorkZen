

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

const managerAuth =async(req,res,next)=>{
  
    try{
      const{email} = req.body;
      const[response] = await knex.select('*').from('userrole').where({email});
    
  
      if(response.role==='admin'||response.role==='project manager'){
          return next();
      }
      else{
          return res.status(403).json({error:'Forbidden: Project manager access required'})
        }
      }
      catch(error){
          return res.status(403).json({error:'Forbidden: Project manager access required'})
    }

}
module.exports = managerAuth;
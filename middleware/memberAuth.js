
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

const memberAuth =async(req,res,next)=>{

    const{email} = req.body;
   const [response] = await knex.select('*').from('userrole').where({email});

    if(response.role==='admin'||response.role==='project manager'||response.role==="team member"){
        return next();
    }
    else{
        return res.status(403).json({error:'Forbidden: Authorized User Access Required'})
    }

}

module.exports = memberAuth;
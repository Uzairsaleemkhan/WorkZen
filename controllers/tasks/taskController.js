const knex =require('../../config/dbConfig');



const verifyDeadline =(deadline)=>{
 
 if(new Date(deadline).getTime()){

   if(new Date(deadline).getTime()>new Date().getTime()){
      return true;
   }
    return false;
 }
   
   return false;

}



const taskController = {

async createTask(req,res, next){



// task routes
// router.post('/api/projects/:projectId/tasks',auth,taskController.createTask)
    // validation for deadline and title description 
   const {title,description,assignedUsername, deadline} = req.body;

   if(!verifyDeadline(deadline)) return res.status(400).json({error:"Invalid date format"})
   const{projectId} = req.params;
   const {userid,role}=req.user;
   let user ;

   // -----------1 get the username of the user
    try {
       user = await knex.select('*').from('users').where({id:userid}).first();
    } catch (error) {
        console.log(error);
       return res.status(500).json({error:'error getting the user from db'})
    }



    // -----------2 first we have to verify that the current user is the member of the project or 'admin'
    // ---projectmembers schema  id--------projectid----------username
        try {
         const userMember = await  knex.select('*').from('projectmembers').where({username:user.username,projectid:projectId})

         if( !userMember[0] && role !== 'admin' ){
            return res.status(401).json({error:'user is not the member'})
         }

        } catch (error) {
            console.log('Server error', error);
            return res.status(401).json({error:"Internal server error"})
        }



    // ------3 -----------
    // task schema 
    // -------id-------title------description-------projectid-------email------assigned------status-------
    // CHECK IF THE ASSINGED USER IS THE PROJECT MEMBER
    try {
       
       const [assignedUser] = await knex.select("*").from('projectmembers').where({username:assignedUsername,projectid:projectId})
       if(!assignedUser){
        return res.status(401).json({error:'assigned user is not the project member'})
       }
      
      
       // insert the task into database
    //   ------------- first get the current time 
       
       const createdTask = await knex.insert({title,description,projectid:projectId,username:user.username,assigned:assignedUsername, start : knex.fn.now(), deadline}).into('tasks').returning('*');

       return res.status(201).json({response: createdTask})
    }
     catch (error) {
        console.log(error);
        res.status(500).json({error:"Internal server error"})
    }
    






},

////////////////////////////////////////////
// get all the tasks for the specific project
////////////////////////////////////////////

async getAllTasksForProject(req,res,next){

  const {projectId} = req.params;
   // now its time to  work for the tasks
   try {
      const tasks  =  await knex.select('*').from('tasks').where({projectid:projectId})
      return res.status(200).json({tasks:tasks})
  } catch (error) {
   console.log(error)
  return res.status(500).json({error:"Error getting the tasks for the project"})        
  }  

}
,



////////////////////////////////////////////
// get task by id for a particular project
////////////////////////////////////////////


async getTaskById(req,res,next){

   const {projectId,taskId } = req.params;

   try {

     const [task] = await knex.select("*").from('tasks').where({projectid:projectId, id:taskId})
      if(!task){
         return res.status(400).json({error:'task not found'})
      }
      return res.status(200).json({task:task})


   } catch (error) {

      console.log(error);
      return res.status(500).json({error:"Internal server error could not get the task"})
      
   }



}

,




////////////////////////////////////////////
// update task for a particular project
////////////////////////////////////////////

async updateTask(req,res,next){

   // updatable content by project manager
   // title--------- description---------- assigned -----------status-------- deadline
   // updatable content by team member or assignee
   // -----------status--------
   const {taskId, projectId} = req.params;
   const {userid,role} = req.user;
   const {status} = req.body;
   let username;


   // getting the username of the user
   try {
      const [user] = await knex.select('*').from('users').where('id','=',userid);
      username = user?.username;
      if(!username){
         return res.status(400).json({error:"user does not exist with current userid"})
      }
   } catch (error) {
      console.log(error)
      res.statu(500).json({error:"Interna server error: when getting the user"})
   }



   // getting the task to perform update action on.
   try {


      
     const [task] = await knex.select("*").from("tasks").where({id:taskId,projectid:projectId})
      if(task.username===username){
           // perform the assigner function
      }
      else if(task.assigned===username) {
         // perform the assignee function 
      }
      else{
         // current user is not related to the task
      }

   } catch (error) {
      console.log(error);
      res.status(500).json({error:"Internal server error getting the task"})
   }





}








}




module.exports = taskController
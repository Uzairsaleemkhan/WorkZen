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



//projects       ----id-----email----------status--------title--------description--------
//projectmembers ----id-----projectid------email------
//projectrole    ----id-----role-----------projectid-----email
//tasks          ----id-----email----------status--------title--------description----projectid-----asssigned



const authController = {
  validateUser: function (username, email, password) {
    //validating username
    if (
      typeof username !== "string" ||
      username.length < 5 ||
      username.length > 100 ||
      username
        .split("")
        .reduce((acc, char) => (char !== " " ? (acc += char) : acc), "")
        .length === 0
    ) {
      return false;
    }
    // validating email
    else if (
      typeof email !== "string" ||
      !email.includes("@") ||
      email.length < 5 ||
      email.length > 100 ||
      email
        .split("")
        .reduce((acc, char) => (char !== " " ? (acc += char) : acc), "")
        .length === 0
    ) {
      return false;
    }
    // validating password
    else if (
      typeof password !== "string" ||
      password.length < 5 ||
      password.length > 100 ||
      password
        .split("")
        .reduce((acc, char) => (char !== " " ? (acc += char) : acc), "")
        .length === 0
    ) {
      return false;
    }
    // if everything is correct returning true
    else {
      return true;
    }
  },
  register: function (req, res, next) {
    const { username, email, password } = req.body;
    // validating user
    const isValid = authController.validateUser(username, email, password);
    if (isValid) {
      // if valid sending data to postgres
      knex.transaction((trx) => {
        //     ---------------auth schema------------
        //users          ----id-----username-------email-------
        //userrole       ----id-----role-----------email-------
        //login          ----id-----hash-----------email----------
       const hash= bcrypt.hashSync(password,10);
       return knex.insert({username,email})
        .into('users')
        .returning('*')
        .transacting(trx)
        .then(userData=>{
         console.log("USERDATA INSERTED:",userData)
         return knex.insert({email})
         .into('userrole')
         .returning('*')
         .transacting(trx)
        })
        .then(userRole=>{
         console.log("USERROLE INSERTED:", userRole)
         return  knex.insert({email,hash})
         .into('login')
         .returning('*')
         .transacting(trx)
        })
        .then(res=>console.log(res,'response from login'))
        .then( trx.commit)
        .catch(trx.rollback)
      })
      .then(_=>res.status(201).json("CREATED USER!!"))
      .catch(err=>{
        console.log(err);
        return  res.status(400).json("DID NOT CREATED THE USER");
      })
    } else {
      return res.status(400).json(" invalid");
    }
  },
  login(req, res, next) {},
  logout(req, res, next) {},
};

module.exports = authController;
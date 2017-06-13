

const users = {
  create:function(user){
    console.log("hey");
    const fields = {
      username: user,
      // password: user.password,
      // firstName: user.firstName,
      // lastName: user.lastName,
      // email: user.email
    }
    return fields;
  },
  get: null,
  put:null,
  delete: null
}

module.exports = {Users: users};

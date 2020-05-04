const mongoose = require('mongoose');
const Schema = mongoose.Schema
const bcrypt = require('bcrypt');
const salt = 10;
mongoose.Promise = global.Promise;
//Validators
// First Name validator
let firstNameLengthChecker = (firstName) =>{
    if(!firstName){
        return false;
    }else{
        if(firstName.length < 3 || firstName.length > 26 ){
            return false;
        }else{
            return true;
        }
    }
};

let validfirstNameChecker = (firstName) =>{
    if(!firstName){
        return false;
    }else{
        const regExp = new RegExp(/^[A-Za-z][A-Za-z\'\-]+([\ A-Za-z][A-Za-z\'\-]+)*/);
        return regExp.test(firstName);
    }
};

// Last Name validator
let lastNameLengthChecker = (lastName) => {
    if(!lastName){
        return false;
    }else{
        if(lastName.length < 3 || lastName.length > 26 ){
            return false;
        }else{
            return true;
        }
    }
};

let validlastNameChecker = (lastName) => {
    if(!lastName){
        return false;
    }else{
        const regExp = new RegExp(/^[A-Za-z][A-Za-z\'\-]+([\ A-Za-z][A-Za-z\'\-]+)*/);
        return regExp.test(lastName)
    }
};

//Email validators
let emailLengthChecker = (email) => {
    if (!email){
        return false;
    }else{
        if (email.length < 5 || email.length > 30){
            return false;
        }else{
            return true;
        }
    }
};

let validEmailChecker = (email) => {
    if(!email){
        return false;
    }else{
        const regExp = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/);
        return regExp.test(email); // Return regular expression test results (true or false)
    }
};

//Username Validators
let usernameLengthChecker = (username) => {
    if(!username){
        return false;
    }else{
        if(username.length < 3 || username.length > 15){
            return false;
        }else{
            return true;
        }
    }
};

let validUsernameChecker = (username) => {
    if(!username){
        return false;
    }else{
        const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
        return regExp.test(username); // Return regular expression test results (true or false)
    }
};

//Password Validators
let passwordLengthChecker = (password) => {
    if(!password){
        return false;
    }else{
        if(password.length < 8 || password.length >35){
            return false;
        }else{
            return true;
        }
    }
};

let validPasswordChecker = (password) => {
    if(!password){
        return false;
    }else{
        const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
        return regExp.test(password) // Return regular expression test results (true or false)
    }
};

// First Name validation
const firstNameValidator = [{
        validator: firstNameLengthChecker,
        message:  'First name must be at least 3 but not more than 28 characters'
    },
    {
        validator: validfirstNameChecker,
        message: 'Must be a valid first name'
    }
];
// Last Name validation
const lastNameValidator = [{
        validator: lastNameLengthChecker,
        message:  'Last name must be at least 3 but not more than 28 characters'
    },
    {
        validator: validlastNameChecker,
        message: 'Must be a valid last name'   
    }
];

// E-mail validation
const emailValidators = [{
        validator: emailLengthChecker,
        message : 'E-mail must be at least 5 characters but no more than 30 characters'
    },
    {
        validator: validEmailChecker,
        message : 'Must be a valid email'  
    }
];
// Username validation
const usernameValidators = [{
        validator: usernameLengthChecker,
        message: 'Username must be at least 3 characters but no more than 15 characters'
    },
    {
        validator: validUsernameChecker,
        message: 'Username must not have any special characters'
    }
];
// Password validation
const passwordValidators = [{
        validator: passwordLengthChecker,
        message: 'Password must be at least 8 characters but no more than 35'
    },{
        validator: validPasswordChecker,
        message: 'Must have at least one uppercase, lowercase, special character, and numbers'
    }
];

// User Model Definition
const AccountSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        validate: firstNameValidator
    },
    lastName: {
        type: String,
        required: true,
        validate: lastNameValidator 
    },
    email: {
        type: String,
        required: true, 
        unique: true, 
        lowercase: true, 
        validate: emailValidators
        },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true, 
        validate: usernameValidators
    },
    password: {
        type: String,
        required: true,
        validate: passwordValidators
    },
    data: {
        type: Date,
        default: Date.now
    }
});

AccountSchema.pre('save', function(next) {
    // Ensure password is new or modified before applying encryption
    if (!this.isModified('password'))
      return next();
  
    // Applying encryption
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err); // Ensure no errors
      this.password = hash; // Apply encryption to password
      next(); // Exit middleware
    });
  });
  
  // Methods to compare password to encrypted password upon login
  AccountSchema.methods.comparePassword = function(password) {
    return bcrypt.compare(password, this.password); // Return comparison of login password to password in database (true or false)
};

//AccountSchema.plugin(passportLocalMongoose, {username: ["email"]});
module.exports = User = mongoose.model('users', AccountSchema)
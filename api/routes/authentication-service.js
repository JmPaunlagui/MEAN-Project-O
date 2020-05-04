const AccountDetails = require ('../models/accountdatamodel');
const jwt = require('jsonwebtoken');
const databaseconfiguration = require('../config/databaseConnection');

module.exports = (router) => {
    //Registration
    router.post('/signup/v4', (req, res) => {
        if (!req.body.firstName){
            res.json({
                success: false,
                message: 'You must provide your first name!'
            });
        }else{
            if (!req.body.lastName){
                res.json({
                    success: false,
                    message: 'You must provide your last name!'
                });
            }else{
                if (!req.body.email){
                    res.json({
                        success: false,
                        message: 'You must provide an email!'
                    });
                }else{
                    if (!req.body.password){
                        res.json({
                            success: false,
                            message: 'You must provide a password!'
                        });
                    }else{
                        let today = new Date();
                        let userAccountData = new AccountDetails({
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            username: req.body.username,
                            email: req.body.email,
                            password: req.body.password,
                            created: today
                        });

                        userAccountData.save(function(err){
                            if (err){
                                if(err.code === 11000){
                                    res.json({
                                        success: false,
                                        message: 'Username or email already exists'
                                    });
                                }else{
                                    if(err.errors){
                                        if (err.errors.firstName){
                                            res.json({
                                                success: false,
                                                message: err.errors.firstName
                                            });
                                        }else{
                                            if (err.errors.lastName){
                                                res.json({
                                                    success: false,
                                                    message: err.errors.lastName
                                                });
                                            }else{
                                                if (err.errors.username){
                                                    res.json({
                                                        success: false,
                                                        message: err.errors.username
                                                    });
                                                }else{
                                                    if(err.errors.email){
                                                        res.json({
                                                            success: false,
                                                            message: err.errors.email
                                                        });
                                                    }else{
                                                        if (err.errors.password){
                                                            res.json({
                                                                success: false,
                                                                message: err.errors.password
                                                            });
                                                        }else{
                                                            res.json({
                                                                success: false,
                                                                message: err
                                                            });
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }else{
                                        res.json({
                                            success: false,
                                            message: 'Couldn`t save user data! Error:  ' + err
                                        });
                                    }
                                }
                            }else{
                                res.json({
                                    success: true,
                                    message: 'Account Registered!'
                                });
                                console.log(req.body);
                            }
                        });
                    }
                }
            }
        }        
    });

    router.get('/checkEmail/:email', (req, res) => {
        if(!req.params.email){
            res.json({
                success: false,
                message: 'E-mail was not provided'
            });
        }else{
            AccountDetails.findOne({ 
                email: req.params.email
            }, (err, user) => {
                if(err){
                    res.json({
                        success: false,
                        message: err
                    });
                }else{
                    if(user){
                        res.json({
                            success: false,
                            message: 'E-mail was already taken!'
                        });
                    }else{
                        res.json({
                            success: true,
                            message: 'Email is available!'
                        });
                    }
                }
            });
        }       
    });

    router.get('/checkUsername/:username', (req, res) => {
        if(!req.params.username){
            res.json({
                success: false,
                message: 'Username was not provided'
            });
        }else{
            AccountDetails.findOne({ 
                username: req.params.username
            }, (err, user) => {
                if(err){
                    res.json({
                        success: false,
                        message: err
                    });
                }else{
                    if(user){
                        res.json({
                            success: false,
                            message: 'Username was already taken!'
                        });
                    }else{
                        res.json({ 
                            success: true, 
                            message: 'Username is available!'
                        });
                    }
                }
            });
        }
    });
    //Signin with Username
    router.post('/signin/v1', (req, res) => {
        if(!req.body.username){
            res.json({
                success: false,
                message: 'Username was not provided!'
            });
        }else{
            if(!req.body.password){
                res.json({
                    success: false,
                    message: 'Password was not provided!'
                });
            }else{
                AccountDetails.findOne({
                    username: req.body.username.toLowerCase()
                }, (err, user) => { 
                        if(err){
                            res.json({
                                success: false,
                                message: err
                            });
                        }else{
                            if(!user){
                                res.json({
                                    success: false,
                                    message: 'Username not found!'
                                });
                            }else{
                                const validPassword = user.comparePassword(req.body.password);
                                if(!validPassword){
                                    res.json({
                                        success: false,
                                        message: 'Password is invalid!'
                                    });
                                }else{
                                    const token = jwt.sign({
                                        userID: user._id }, 
                                        databaseconfiguration.secret,{
                                        expiresIn: '24h'
                                    });
                                    res.json({
                                        success: true,
                                        message: 'Successfully signed in!',
                                        token: token,
                                        user: {
                                            username: user.username,
                                            email: user.email
                                        }
                                    });
                                    console.log(req.body);
                                }
                            }
                        }
                    }
                );
            }
        }
    });
    //Signin with email
    router.post('/signin/v2', (req, res) => {
        if(!req.body.email){
            res.json({
                success: false,
                message: 'E-mail was not provided!'
            });
        }else{
            if(!req.body.password){
                res.json({
                    success: false,
                    message: 'Password was not provided!'
                });
            }else{
                AccountDetails.findOne({
                    email: req.body.email.toLowerCase()
                }, (err, user) => { 
                        if(err){
                            res.json({
                                success: false,
                                message: err
                            });
                        }else{
                            if(!user){
                                res.json({
                                    success: false,
                                    message: 'E-mail not found!'
                                });
                            }else{
                                const validPassword = user.comparePassword(req.body.password);
                                if(!validPassword){
                                    res.json({
                                        success: false,
                                        message: 'Password is invalid!'
                                    });
                                }else{
                                    const token = jwt.sign({
                                        userID: user._id }, 
                                        databaseconfiguration.secret,{
                                        expiresIn: '24h'
                                    });
                                    res.json({
                                        success: true,
                                        message: 'Successfully signed in!',
                                        token: token,
                                        user: {
                                            username: user.username,
                                            email: user.email
                                        }
                                    });
                                    console.log(req.body);
                                }
                            }
                        }
                    }
                );
            }
        }
    });

    router.use((req, res, next) => {
        const token = req.headers['authorization'];// Create token found in headers
        if(!token){
            res.json({
                success: false,
                message: 'No token provided!'
            });
        }else{
            jwt.verify(token, databaseconfiguration.secret, (err, decoded) => {
                // Check if error is expired or invalid
                if(err){
                    res.json({
                        success: false,
                        message: 'Invalid token: ' + err
                    });
                }else{
                    req.decoded = decoded; // Create global variable to use in any request beyond
                    next();// Exit middleware
                }
            });
        }
    });

    router.get('/profile', (req, res) => {
        const decoded = jwt.verify(req.headers['authorization'], databaseconfiguration.secret)
        AccountDetails.findOne({
            _id: req.decoded._Id
        }).select('username email').exec((err,user) => {
            if(err){
                res.json({
                    success: false,
                    message: err
                });
            }else{
                if(!user){
                    res.json({
                        success: false,
                        message: 'User not found!'
                    });
                }else{
                    res.json({
                        success: true,
                        user: user
                    });
                }
            }
        });
    });
    return router;
}
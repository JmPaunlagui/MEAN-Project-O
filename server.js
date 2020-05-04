const express = require('express');
const app = express();
const router = express.Router();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const port = process.env.PORT || 8080
//authentication-service
const databaseconfiguration = require('./api/config/databaseConnection');
const authentication_service = require('./api/routes/authentication-service')(router);

//Connecting to database
mongoose.connect(
    databaseconfiguration.uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }, (err) => {
        if (err) {
            console.log('Could NOT connect to database: ', err); // Return error
        }else{
            console.log('Connected to database: ' + databaseconfiguration.db);// Return success
        }
    }
);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
    })
);
app.use('/authentication-service', authentication_service);

//Listening on port 8080
app.listen(port, () => {
        console.log('Server is running on port: ' + port);
    }
);
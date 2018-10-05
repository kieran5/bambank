import express from 'express';
import routes from './routes/';
import bodyParser from 'body-parser';
import mongoose from 'mongoose'
import session from 'express-session';
import cors from 'cors'

const app = express()
const router = express.Router()

let port = 5000 || process.env.PORT

// Mongoose connection
// Use a promise to make sure a connection is definitely made &
// the server does not just sit waiting for a connection
// TODO: Need to add error handling for this Promise
mongoose.Promise = global.Promise;
// Connect to mongo on localhost
mongoose.connect('mongodb://localhost/BambankDB');
var db = mongoose.connection;

// Body parser setup
// This is required in order for us to make POST's to the Mongo database
// Makes data available in req.body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors())

// Setup sessions to be used for login
// Needs to be setup after body parsed as we need the parsed values to place them in to a session
// Resave is set to false as this would resave the session on every request which
// is not required as we will only need to save and update a session on specific requests
// saveUnitialized set to false so that sessions are only saved once they have been initialised
// with some data (e.g. req.session.user has a value assigned to it)
app.use(session({
  secret: 'big-secret',
  resave: false,
  saveUnitialized: false
  /*store: new MongoStore({
    mongooseConnection: db
  }),
  // maxAge expects ms - hours * 60 minutes * 60 seconds * 1000 ms
  cookie: { maxAge: 1 * 60 * 1000 }*/
}));

/** set up routes {API Endpoints} */
routes(router)

app.use('/bambank', router)

/** start server */
app.listen(port, () => {
    console.log(`Server started at port: ${port}`);
});

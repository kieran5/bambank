import mongoose from 'mongoose';
import { UserSchema } from '../models/userModel';
import bcrypt from 'bcryptjs';

export const User = mongoose.model('User', UserSchema);

// Exported function for register user route to use
export const createUser = (req, res) => {
  // Check password field matches the password confirmed field
  // Show error message if they do not match
  //if(req.body.password === req.body.passwordConf) {
  if(true) {
    console.log("req", req.body)
    // Pass username and password fields text in to a new User object
    // We leave the passwordConf out of this object as we only want to hash
    // and save the password once to the DB
    let newUser = new User({
      username: req.body.username,
      password: req.body.password
    });

    // Prior to saving our modelled object to the database, we want to hash the password
    // making use of the bcrpyt module. I used the below tutorial to help me a little:
    // https://medium.com/of-all-things-tech-progress/starting-with-authentication-a-tutorial-with-node-js-and-mongodb-25d524ca0359
    UserSchema.pre('save', function(next) {

      // Using bcrpyt's hash function to pass in the plain text password to be encrpyted
      // Using 10 salt rounds to hash the password - this is the computational cost on the processing of the hash
      bcrypt.hash(newUser.password, 10, function (err, hash) {
        if (err) {
          res.send(err);
        } else {
          // If no errors occur, we pass the hash in to the object ready to be saved to the DB
          newUser.password = hash;

          // Call next on this function as it is middleware
          // Without this, the below function would never be called and the object wouldn't get saved to the DB
          next();
        }
      })
    });

    // Saving our new user object to the Mongo DB
    newUser.save((err, user) => {
      if (err) {
        res.send(err);
      } else {

        res.json({
          userId: user._id,
          username: user.username,
          balance: user.balance,
          message: "Registration successful!"
        });

      }
    });
  } else {
    // Send error if password and confirm password fields are not the same
    res.json('Password and confirm password fields are different.');
  }
};

// Function to check user credentials and log in making use of a session
export const checkUser = (req, res) => {
  // Get hashed password for user from database
  // Find user by the username entered in to the text field by the user
  // Ask for the password field from the database and execute callback function
  User.findOne({ 'username': req.body.username }, (err, user) => {
    if (err) {
      res.send(err);
    } else if(!user) {
      // No username in database matching provided username
      res.json("No such username! Try again or register.");

    } else {
      // bcrypt compare function will take the password entered in to the text
      // field, hash it, then compare with the hash pulled from the database
      bcrypt.compare(req.body.password, user.password, function(err, match) {
        if(match) {
          // Passwords match
          // Return user to homepage with success message
          res.json({
            userId: user._id,
            username: user.username,
            balance: user.balance,
            message: "Logged in successfully!"
          });
          //res.redirect('/');


        } else {
          // Password do not match
          // Return user to login page with error message
          return res.json("Incorrect username or password.");
        }
      });
    }
  });
};
//
// // Function to log out and destroy the current user session
// export const logoutUser = (req, res) => {
//   // If a user session exists
//   var user = localStorage.getItem('userId')
//
//   if(user) {
//     console.log("User exists.");
//
//     localStorage.removeItem('userId')
//
//   } else {
//     return res.json("User does not exist...");
//   }
// };

// Return current logged in user from session so front end knows which buttons to display etc.
export const getCurrentUser = (req, res) => {
  console.log("my username", req.body.username)

  User.findOne({ 'username': req.body.username}, (err, user) => {
    if (err) res.send(err);

    res.json(user);
  });

};

// Get all users function so that we can display a full list of users to admins
// so they can edit or delete user accounts
export const getAllUsers = (req, res) => {
  User.find({ }, 'username', (err, user) => {
    if (err) res.send(err);

    res.json(user);
  });
};


export const transferToUser = (req, res) => {
  // var userSending = req.userSending;
  // var userReceiving = req.userReceiving;
  // var amount = req.amount;

  User.findOne({ 'username': req.body.userReceiving }, (err, userReceiving) => {
    if(!userReceiving) {
      res.json({
        message: "User does not exist!"
      })
    }
    else {
      User.findOne({ 'username': req.body.userSending }, (err, userSending) => {
        if(userSending.balance < req.body.amount) {
          res.json({
            message: "Not enough funds!"
          })
        }
        else {
          User.findOneAndUpdate({ 'username': req.body.userSending}, { $inc: {balance: -req.body.amount} }, { new: true }, (err) => {
            if (err) {
              res.send(err)
            }
            else {
              User.findOneAndUpdate({ 'username': req.body.userReceiving}, { $inc: {balance: req.body.amount} }, { new: true }, (err) => {
                if (err) {
                  res.send(err)
                }
                else {
                  res.json({
                    message: "Transfer successful!"
                  })
                }
              })
            }
          })
        }
      })
    }
  })
}

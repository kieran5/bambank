const userController = require('../controllers/userController')

module.exports = (router) => {
  router
    .route('/register')
    .post(userController.createUser);

  router
    .route('/allUsers')
    .get(userController.getAllUsers)
}

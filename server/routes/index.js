const userController = require('../controllers/userController')

module.exports = (router) => {
  router
    .route('/register')
    .post(userController.createUser);

  router
    .route('/login')
    .post(userController.checkUser);

  router
    .route('/allUsers')
    .get(userController.getAllUsers);

  router
    .route('/user')
    .post(userController.getCurrentUser)

  router
    .route('/transfer')
    .post(userController.transferToUser)

}

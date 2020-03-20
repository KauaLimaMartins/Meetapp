const { Router } = require('express');

const UserController = require('./app/controllers/UserController');
const SessionController = require('./app/controllers/SessionController');

const authMiddle = require('./app/middlewares/authMiddle');

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddle);

routes.put('/users', UserController.update);

module.exports = routes;

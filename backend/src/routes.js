const { Router } = require('express');
const multer = require('multer');

const multerConfig = require('./config/multer');

const SessionController = require('./app/controllers/SessionController');
const UserController = require('./app/controllers/UserController');
const FileController = require('./app/controllers/FileController');
const MeetupController = require('./app/controllers/MeetupController');

const authMiddle = require('./app/middlewares/authMiddle');

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddle);

routes.put('/users', UserController.update);
routes.delete('/users', UserController.destroy);

routes.post('/files', upload.single('file'), FileController.store);

routes.get('/meetups', MeetupController.index);
routes.post('/meetups', MeetupController.store);
routes.put('/meetups/:meetup_id', MeetupController.update);
routes.delete('/meetups/:meetup_id', MeetupController.destroy);

module.exports = routes;

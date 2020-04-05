const { Router } = require('express');
const multer = require('multer');

const multerConfig = require('./config/multer');

const SessionController = require('./app/controllers/SessionController');
const UserController = require('./app/controllers/UserController');
const FileController = require('./app/controllers/FileController');
const MeetupController = require('./app/controllers/MeetupController');
const SubscriptionController = require('./app/controllers/SubscriptionController');
const UserMeetupController = require('./app/controllers/UserMeetupController');

const authMiddle = require('./app/middlewares/authMiddle');

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddle);

routes.put('/users', UserController.update);
routes.delete('/users', UserController.destroy);

routes.get('/meetup', MeetupController.index);
routes.post('/meetup', MeetupController.store);
routes.put('/meetup/:meetup_id', MeetupController.update);
routes.delete('/meetup/:meetup_id', MeetupController.destroy);

routes.get('/subscribe', SubscriptionController.index);
routes.post('/subscribe/:meetup_id', SubscriptionController.store);

routes.get('/user_meetups', UserMeetupController.index);

routes.post('/files', upload.single('file'), FileController.store);

module.exports = routes;

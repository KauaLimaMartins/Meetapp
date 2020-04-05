const Sequelize = require('sequelize');

const dbConfig = require('../config/database');

const User = require('../app/models/User');
const File = require('../app/models/File');
const Meetup = require('../app/models/Meetup');
const Subscription = require('../app/models/Subscription');

const models = [User, File, Meetup, Subscription];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(dbConfig);

    models.map(model => model.init(this.connection));
    models.forEach(model => {
      if (model.associate) {
        model.associate(this.connection.models);
      }
    });
  }
}

module.exports = new Database();

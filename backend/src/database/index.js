const Sequelize = require('sequelize');

const dbConfig = require('../config/database');

const User = require('../app/models/User');
const File = require('../app/models/File');
const Meetup = require('../app/models/Meetup');

const models = [User, File, Meetup];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(dbConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

module.exports = new Database();

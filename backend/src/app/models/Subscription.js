const { Model } = require('sequelize');

class Subscription extends Model {
  static init(sequelize) {
    super.init({}, { sequelize });
  }

  static associate(models) {
    this.belongsTo(models.Meetup, { foreignKey: 'meetup_id' });
    this.belongsTo(models.User, { foreignKey: 'user_id' });
  }
}

module.exports = Subscription;

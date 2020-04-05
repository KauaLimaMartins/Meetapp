const Sequelize = require('sequelize');
const { Model } = require('sequelize');
const { isBefore } = require('date-fns');

class Meetup extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        description: Sequelize.STRING,
        location: Sequelize.STRING,
        date: Sequelize.DATE,
        past: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(this.date, new Date());
          },
        },
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.hasMany(models.Subscription, { foreignKey: 'meetup_id' });
    this.belongsTo(models.User, { foreignKey: 'user_id' });
    this.belongsTo(models.File, { foreignKey: 'image_id' });
  }
}

module.exports = Meetup;

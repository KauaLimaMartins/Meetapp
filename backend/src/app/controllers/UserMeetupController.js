const Subscription = require('../models/Subscription');

class UserMeetupController {
  async index(req, res) {
    const meetups = await Subscription.findAll({
      where: { user_id: req.userId },
    });

    return res.json(meetups);
  }
}

module.exports = new UserMeetupController();

const { Op } = require('sequelize')
const { startOfDay, endOfDay, parseISO } = require('date-fns');

const Meetup = require('../models/Meetup');
const User = require('../models/User');
const Subscription = require('../models/Subscription');

const Mail = require('../../lib/Mail');

class SubscriptionController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const where = {};

    if (req.query.date) {
      const searchDate = parseISO(req.query.date);

      where.date = {
        [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
      };
    }

    const meetups = await Meetup.findAll({
      where,
      include: [User],
      limit: 10,
      offset: (page - 1) * 10,
    });

    return res.json(meetups);
  }

  async store(req, res) {
    const user = await User.findByPk(req.userId);
    const meetup = await Meetup.findByPk(req.params.meetup_id);
    const userOfMeetup = await User.findOne({ where: { id: meetup.user_id } });

    if (user.id === meetup.user_id) {
      return res
        .status(401)
        .json({ error: "You can't sign up for meetups that are yours" });
    }

    if (meetup.past) {
      return res.status(401).json({
        error: 'You cannot sign up for meetups that have already taken place',
      });
    }

    const checkDate = await Subscription.findOne({
      where: { user_id: user.id },
      include: [
        {
          model: Meetup,
          required: true,
          where: {
            date: meetup.date,
          },
        },
      ],
    });

    if (checkDate) {
      return res.status(401).json({
        error: 'You already have a meetup at this time',
      });
    }

    const subscription = await Subscription.create({
      user_id: user.id,
      meetup_id: meetup.id,
    });

    await Mail.sendMail({
      to: `${userOfMeetup.name} <${userOfMeetup.email}>`,
      subject: `Novo participante em seu Meetup`,
      html: ``,
    });

    return res.json(subscription);
  }
}

module.exports = new SubscriptionController();

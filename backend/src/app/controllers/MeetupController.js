const Yup = require('yup');
const { parseISO, isBefore, startOfHour, subHours } = require('date-fns');

const Meetup = require('../models/Meetup');

class MeetupController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const allMeetups = await Meetup.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'title', 'description', 'date', 'location'],
      limit: 10,
      offset: (page - 1) * 10,
    });

    return res.json(allMeetups);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string()
        .required()
        .min(3),
      description: Yup.string()
        .required()
        .min(10),
      location: Yup.string().required(),
      date: Yup.date().required(),
      image_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const hourStart = startOfHour(parseISO(req.body.date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not premitted' });
    }

    const checkAvailable = await Meetup.findOne({
      where: {
        user_id: req.userId,
        date: hourStart,
        canceled_at: null,
      },
    });

    if (checkAvailable) {
      return res
        .status(401)
        .json({ error: 'You already have a meetup on this date' });
    }

    const meetup = await Meetup.create({
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      date: req.body.date,
      image_id: req.body.image_id,
      user_id: req.userId,
    });

    return res.json(meetup);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().min(3),
      description: Yup.string().min(10),
      location: Yup.string(),
      date: Yup.date(),
      image_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const meetup = await Meetup.findByPk(req.params.meetup_id);

    const user = await Meetup.findOne({
      where: { user_id: req.userId },
    });

    if (!user) {
      return res
        .status(401)
        .json({ error: 'You can only change your meetups' });
    }

    const dateWithSub = subHours(meetup.date, 2);

    if (isBefore(dateWithSub, new Date())) {
      return res
        .status(401)
        .json('You can only change your meetups 2 hours before');
    }

    meetup.update(req.body);

    return res.json(meetup);
  }

  async destroy(req, res) {
    const meetup = await Meetup.findByPk(req.params.meetup_id);

    const user = await Meetup.findOne({ where: { user_id: req.userId } });

    if (!user) {
      return res
        .status(401)
        .json({ error: 'You can only delete your meetups' });
    }

    const dateWithSub = subHours(meetup.date, 2);

    if (isBefore(dateWithSub, new Date())) {
      return res
        .status(401)
        .json('You can only delete your meetups 2 hours before');
    }

    await meetup.destroy();

    return res.send();
  }
}

module.exports = new MeetupController();

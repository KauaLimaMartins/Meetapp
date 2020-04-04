const File = require('../models/File');

class FileController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    await File.create({ name, path });

    return res.json({ name, path });
  }
}

module.exports = new FileController();

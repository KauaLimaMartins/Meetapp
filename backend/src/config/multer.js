const multer = require('multer');
const crypto = require('crypto');
const { extname, resolve } = require('path');

module.exports = {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'temp', 'uploads'),
    filename: (request, file, callback) => {
      crypto.randomBytes(12, (err, response) => {
        if (err) return callback(err);

        return callback(
          null,
          response.toString('hex') + extname(file.originalname)
        );
      });
    },
  }),
};

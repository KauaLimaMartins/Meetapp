module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'kaua',
  database: 'meetapp',

  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};

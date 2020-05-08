module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'biosemana',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};

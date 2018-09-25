const models = require(`${process.cwd()}/src/server/models/index`);

module.exports = {
  dropDatabase() {
    return models.sequelize.sync({ force: true }).then(() => {
      // console.log('db dropped'); // eslint-disable-line no-console
    });
  },
};

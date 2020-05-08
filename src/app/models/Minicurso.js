import Sequelize, { Model } from 'sequelize';

class Minicurso extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        description: Sequelize.STRING,
        speaker: Sequelize.STRING,
        shift: Sequelize.STRING,
        size: Sequelize.INTEGER,
      },
      { sequelize }
    );

    return this;
  }
}
export default Minicurso;

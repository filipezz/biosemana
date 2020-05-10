import Sequelize, { Model } from 'sequelize';

class Participant extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        cpf: Sequelize.INTEGER,
      },

      { sequelize }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Minicurso, {
      foreignKey: 'minicurso_diurno_id',
      as: 'minicurso_diurno',
    });
    this.belongsTo(models.Minicurso, {
      foreignKey: 'minicurso_noturno_id',
      as: 'minicurso_noturno',
    });
  }
}

export default Participant;

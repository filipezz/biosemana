module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('participants', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      cpf: {
        type: Sequelize.STRING,

        allowNull: false,
      },
      minicurso_diurno_id: {
        type: Sequelize.INTEGER,
        references: { model: 'minicursos', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      minicurso_noturno_id: {
        type: Sequelize.INTEGER,
        references: { model: 'minicursos', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('participants');
  },
};

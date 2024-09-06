'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('idiomas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nivelDominio: {
        type: Sequelize.ENUM('básico', 'intermedio', 'avanzado', 'experto'),
        allowNull: false
      },
      usuarioId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',  // Nombre de la tabla referenciada
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('idiomas');
  }
};


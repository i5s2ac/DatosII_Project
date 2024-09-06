'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('perfil_usuarios', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      resumenProfesional: {
        type: Sequelize.TEXT
      },
      ubicacion: {
        type: Sequelize.STRING
      },
      fechaUltimaActualizacion: {
        type: Sequelize.DATE
      },
      usuarioId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users', // Nombre de la tabla que referencia
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
    await queryInterface.dropTable('perfil_usuarios');
  }
};

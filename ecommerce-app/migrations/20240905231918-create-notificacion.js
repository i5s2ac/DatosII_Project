'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('notificaciones', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      mensaje: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      fechaEnvio: {
        type: Sequelize.DATE,
        allowNull: false
      },
      estado: {
        type: Sequelize.ENUM('leída', 'no leída'),
        allowNull: false
      },
      usuarioId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',  // Nombre de la tabla que referencia
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
    await queryInterface.dropTable('notificaciones');
  }
};

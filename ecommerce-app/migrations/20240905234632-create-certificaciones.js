'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('certificaciones', {
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
      organizacionEmisora: {
        type: Sequelize.STRING
      },
      fechaObtencion: {
        type: Sequelize.DATE
      },
      descripcion: {
        type: Sequelize.TEXT
      },
      perfilUsuarioId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'perfil_usuarios',  // Nombre de la tabla referenciada
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
    await queryInterface.dropTable('certificaciones');
  }
};

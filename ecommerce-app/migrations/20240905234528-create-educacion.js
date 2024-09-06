'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('educacion', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      institucion: {
        type: Sequelize.STRING,
        allowNull: false
      },
      gradoObtenido: {
        type: Sequelize.STRING
      },
      campoEstudio: {
        type: Sequelize.STRING
      },
      fechaInicio: {
        type: Sequelize.DATE
      },
      fechaFin: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('educacion');
  }
};


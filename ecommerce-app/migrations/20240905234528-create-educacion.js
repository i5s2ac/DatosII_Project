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
        type: Sequelize.DATEONLY
      },
      fechaFin: {
        type: Sequelize.DATEONLY
      },
      usuarioid: {
        type: Sequelize.INTEGER,
        allowNull: false,  // No permite valores nulos
        references: {
          model: 'users',  // Nombre del modelo referenciado (ajusta si el nombre del modelo es diferente)
          key: 'id',       // Clave foránea que hace referencia al campo 'id' del modelo referenciado
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


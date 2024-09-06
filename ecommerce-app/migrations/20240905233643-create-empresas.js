'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('empresas', {
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
      direccion: {
        type: Sequelize.STRING
      },
      telefono: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      sitioWeb: {
        type: Sequelize.STRING
      },
      descripcion: {
        type: Sequelize.TEXT
      },
      industriaId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'industrias',  // Nombre de la tabla referenciada
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
    await queryInterface.dropTable('empresas');
  }
};

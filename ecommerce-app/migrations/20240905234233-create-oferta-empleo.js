'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ofertas_empleos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      titulo: {
        type: Sequelize.STRING,
        allowNull: false
      },
      descripcion: {
        type: Sequelize.TEXT
      },
      ubicacion: {
        type: Sequelize.STRING
      },
      salario: {
        type: Sequelize.DECIMAL
      },
      fechaPublicacion: {
        type: Sequelize.DATE
      },
      fechaCierre: {
        type: Sequelize.DATE
      },
      empresaId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'empresas',  // Asegúrate de que el nombre de la tabla coincida con el de Empresa
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
    await queryInterface.dropTable('ofertas_empleos');
  }
};

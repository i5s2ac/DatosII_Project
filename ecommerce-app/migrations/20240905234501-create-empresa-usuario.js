'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('empresa_usuario', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      empresaId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'empresas',  // Nombre de la tabla referenciada
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
      rolId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'roles',  // Nombre de la tabla referenciada
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
    await queryInterface.dropTable('empresa_usuario');
  }
};

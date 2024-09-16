'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('historial_aplicaciones', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fechaAplicacion: {
        type: Sequelize.DATE,
        allowNull: false
      },
      estadoAplicacion: {
        type: Sequelize.ENUM('pendiente', 'en proceso', 'aceptada', 'rechazada'),
        allowNull: false
      },
      usuarioId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users', // Nombre de la tabla relacionada con el modelo User
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      ofertaEmpleoId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'ofertas_empleos', // Nombre de la tabla relacionada con el modelo OfertaEmpleo
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
    await queryInterface.dropTable('historial_aplicaciones');
  }
};

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Candidato_Oferta', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      estado: {
        type: Sequelize.ENUM('pendiente', 'en proceso', 'aceptada', 'rechazada'),
        allowNull: false,
      },
      usuarioId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',  // El nombre de la tabla de usuarios
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      ofertaEmpleoId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'ofertas_empleos',  // El nombre de la tabla de ofertas de empleo
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Candidato_Oferta');
  }
};

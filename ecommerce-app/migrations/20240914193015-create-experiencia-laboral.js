'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('experiencia_laboral', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,  // Define esta columna como la clave primaria
        allowNull: false,  // No permite valores nulos
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
      titulo_puesto: {
        type: Sequelize.STRING,
        allowNull: false,  // No permite valores nulos
      },
      empresa: {
        type: Sequelize.STRING,
        allowNull: false,  // No permite valores nulos
      },
      ubicacion: {
        type: Sequelize.STRING,
        allowNull: true,  // Permite valores nulos
      },
      fecha_inicio: {
        type: Sequelize.DATEONLY,
        allowNull: true,  // Permite valores nulos
      },
      fecha_fin: {
        type: Sequelize.DATEONLY,
        allowNull: true,  // Permite valores nulos
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true,  // Permite valores nulos
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
    await queryInterface.dropTable('experiencia_laboral');
  }
};


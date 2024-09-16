'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Skills', {
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
      nivelDominio: {
        type: Sequelize.ENUM('básico', 'intermedio', 'avanzado', 'experto'),  // Aquí agregas el ENUM manualmente
        allowNull: false
      },
      descripcion: {
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('Skills');
  }
};
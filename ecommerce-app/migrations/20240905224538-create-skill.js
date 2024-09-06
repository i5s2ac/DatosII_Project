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
      perfilUsuarioId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'perfil_usuarios', // Asegúrate que el nombre coincida con el de la tabla de PerfilUsuario
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
    await queryInterface.dropTable('Skills');
  }
};
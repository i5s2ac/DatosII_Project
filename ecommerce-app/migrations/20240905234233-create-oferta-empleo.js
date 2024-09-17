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
        type: Sequelize.TEXT,
        allowNull: false
      },
      ubicacion: {
        type: Sequelize.STRING
      },
      salario: {
        type: Sequelize.DECIMAL
      },
      fechaPublicacion: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      fechaCierre: {
        type: Sequelize.DATE
      },
      empresaId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'empresas',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false
      },
      estatus: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Activo'
      },
      // Cambiamos ARRAY a TEXT para MySQL, y almacenaremos los tags como una cadena separada por comas
      tags: {
        type: Sequelize.TEXT,  // Usamos TEXT en lugar de ARRAY
        allowNull: true,
        // Nota: no podemos aplicar validaciones de longitud directamente en el SQL, por lo que se manejará en el backend
      },
      modalidad: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Presencial'
      },
      tipoTrabajo: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Tiempo Completo'
      },

      // Nuevos campos agregados
      Funciones_Requerimiento: {
        type: Sequelize.STRING,
        allowNull: true, // Ajusta según tus necesidades
      },
      Estudios_Requerimiento: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      Experiencia_Requerimiento: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      Conocimientos_Requerimiento: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      Competencias__Requerimiento: { // Verifica si el doble guion bajo es intencional
        type: Sequelize.STRING,
        allowNull: true,
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

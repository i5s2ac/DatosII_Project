'use strict';

const faker = require('faker');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const empresaUsuario = [];
    const numRegistros = 50; // Número de registros a crear

    // Obtener IDs de empresas, usuarios y roles existentes usando queryInterface.sequelize.query
    const empresas = await queryInterface.sequelize.query(
        'SELECT id FROM empresas',
        { type: Sequelize.QueryTypes.SELECT }
    );

    const usuarios = await queryInterface.sequelize.query(
        'SELECT id FROM users',
        { type: Sequelize.QueryTypes.SELECT }
    );

    const roles = await queryInterface.sequelize.query(
        'SELECT id FROM roles',
        { type: Sequelize.QueryTypes.SELECT }
    );

    // Verifica si obtuviste los datos correctos
    if (!empresas.length || !usuarios.length || !roles.length) {
      throw new Error('No se encontraron empresas, usuarios o roles para asociar con los registros.');
    }

    // Generar datos falsos para la tabla empresa_usuario
    for (let i = 0; i < numRegistros; i++) {
      empresaUsuario.push({
        empresaId: faker.random.arrayElement(empresas).id, // Accede al campo 'id'
        usuarioId: faker.random.arrayElement(usuarios).id, // Accede al campo 'id'
        rolId: faker.random.arrayElement(roles).id,        // Accede al campo 'id'
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // Insertar los datos en la base de datos
    await queryInterface.bulkInsert('empresa_usuario', empresaUsuario, {});

    console.log('Datos de empresa_usuario han sido añadidos a la base de datos');

    // Crear un archivo CSV con los datos generados
    const csvWriter = createCsvWriter({
<<<<<<< Updated upstream
      path: 'C:/Users/Paco/Desktop/Test/empresa_usuario.csv', // Cambia el path según tu ubicación deseada
=======
      path: '/Users/isaacjuarez/Desktop/Faker/empresa_usuario.csv', // Cambia el path según tu ubicación deseada
>>>>>>> Stashed changes
      header: [
        { id: 'empresaId', title: 'Empresa ID' },
        { id: 'usuarioId', title: 'Usuario ID' },
        { id: 'rolId', title: 'Rol ID' }
      ]
    });

    // Escribir los datos en el archivo CSV
    await csvWriter.writeRecords(empresaUsuario);
    console.log('Datos de empresa_usuario han sido escritos en el CSV');
  },

  down: async (queryInterface, Sequelize) => {
    // Eliminar datos de empresa_usuario si es necesario
    await queryInterface.bulkDelete('empresa_usuario', null, {});
  }
};

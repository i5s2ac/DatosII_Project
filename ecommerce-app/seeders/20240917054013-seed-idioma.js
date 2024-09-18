'use strict';

const faker = require('faker');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const idiomas = [];
    const numIdiomas = 50; // Número de idiomas a crear

    // Obtener IDs de usuarios existentes
    const usuarios = await queryInterface.rawSelect('users', {
      attributes: ['id'],
      where: {},
    }, ['id']);

    if (usuarios.length === 0) {
      throw new Error('No users found to associate languages with.');
    }

    // Generar datos falsos para la tabla Idiomas
    for (let i = 0; i < numIdiomas; i++) {
      const nivelDominio = faker.random.arrayElement(['básico', 'intermedio', 'avanzado', 'experto']);
      idiomas.push({
        nombre: faker.random.word(),
        nivelDominio: nivelDominio,
        usuarioId: faker.random.arrayElement(usuarios), // Seleccionar un usuario al azar
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // Insertar los datos en la base de datos
    await queryInterface.bulkInsert('idiomas', idiomas, {});

    console.log('Idiomas have been added to the database');

    // Crear un archivo CSV con los datos generados
    const csvWriter = createCsvWriter({
<<<<<<< Updated upstream
      path: 'C:/Users/Paco/Desktop/Test/idiomas.csv', // Cambia el path según tu ubicación deseada
=======
      path: '/Users/isaacjuarez/Desktop/Faker/idiomas.csv', // Cambia el path según tu ubicación deseada
>>>>>>> Stashed changes
      header: [
        { id: 'nombre', title: 'Nombre' },
        { id: 'nivelDominio', title: 'Nivel Dominio' },
        { id: 'usuarioId', title: 'Usuario ID' }
      ]
    });

    // Escribir los datos en el archivo CSV
    await csvWriter.writeRecords(idiomas);
    console.log('Idiomas have been written to CSV');
  },

  down: async (queryInterface, Sequelize) => {
    // Eliminar idiomas si es necesario
    await queryInterface.bulkDelete('idiomas', null, {});
  }
};

'use strict';

const faker = require('faker');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const empresas = [];
    const numEmpresas = 50; // Número de empresas a crear

    // Obtener IDs de industrias para asignar
    const industrias = await queryInterface.rawSelect('industrias', {
      attributes: ['id'],
      where: {},
    }, ['id']);

    // Generar datos falsos para la tabla empresas
    for (let i = 0; i < numEmpresas; i++) {
      empresas.push({
        nombre: faker.company.companyName(),
        direccion: faker.address.streetAddress(),
        telefono: faker.phone.phoneNumber(),
        email: faker.internet.email(),
        sitioWeb: faker.internet.url(),
        descripcion: faker.company.catchPhrase(),
        industriaId: industrias[Math.floor(Math.random() * industrias.length)], // Selección aleatoria de industriaId
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // Insertar los datos en la base de datos
    await queryInterface.bulkInsert('empresas', empresas, {});

    console.log('Empresas have been added to the database');

    // Crear un archivo CSV con los datos generados
    const csvWriter = createCsvWriter({
<<<<<<< Updated upstream
      path: 'C:/Users/Paco/Desktop/Test/empresas.csv', // Cambia el path según tu ubicación deseada
=======
      path: '/Users/isaacjuarez/Desktop/Faker/empresas.csv', // Cambia el path según tu ubicación deseada
>>>>>>> Stashed changes
      header: [
        { id: 'nombre', title: 'Nombre' },
        { id: 'direccion', title: 'Direccion' },
        { id: 'telefono', title: 'Telefono' },
        { id: 'email', title: 'Email' },
        { id: 'sitioWeb', title: 'Sitio Web' },
        { id: 'descripcion', title: 'Descripcion' },
        { id: 'industriaId', title: 'Industria ID' }
      ]
    });

    // Escribir los datos en el archivo CSV
    await csvWriter.writeRecords(empresas);
    console.log('Empresas have been written to CSV');
  },

  down: async (queryInterface, Sequelize) => {
    // Eliminar empresas si es necesario
    await queryInterface.bulkDelete('empresas', null, {});
  }
};

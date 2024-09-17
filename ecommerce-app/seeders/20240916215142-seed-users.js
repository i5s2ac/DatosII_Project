'use strict';

const faker = require('faker');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = [];
    for (let i = 0; i < 1000; i++) {
      users.push({
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        telefono: faker.phone.phoneNumber(),
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // Inserta los usuarios en la base de datos
    await queryInterface.bulkInsert('users', users, {});
    console.log('1000 users have been added to the database');

    // Crear un escritor de CSV
    const csvWriter = createCsvWriter({
      path: 'C:/Users/Paco/Desktop/Faker/users.csv', // Cambia el path según tu ubicación deseada
      header: [
        { id: 'username', title: 'Username' },
        { id: 'email', title: 'Email' },
        { id: 'password', title: 'Password' },
        { id: 'telefono', title: 'telefono' }
      ]
    });

    // Escribir los datos en un archivo CSV
    await csvWriter.writeRecords(users);
    console.log('Users have been written to CSV');
  },

  down: async (queryInterface, Sequelize) => {
    // Opcional: Elimina los usuarios si es necesario
    await queryInterface.bulkDelete('users', null, {});
  }
};

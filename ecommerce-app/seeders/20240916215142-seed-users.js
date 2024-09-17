'use strict';

const faker = require('faker');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const users = [];
      const emailSet = new Set(); // Usamos un Set para asegurarnos de que los correos sean únicos

      while (users.length < 10000) {
        const email = faker.internet.email();

        // Asegurarse de que el email es único
        if (!emailSet.has(email)) {
          emailSet.add(email);

          users.push({
            username: faker.internet.userName(),
            email: email,
            password: faker.internet.password(),
            telefono: faker.phone.phoneNumber(),
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      }

      // Limpia la tabla antes de insertar datos
      await queryInterface.bulkDelete('users', null, {});

      // Inserta los usuarios en la base de datos
      await queryInterface.bulkInsert('users', users, {});
      console.log('10000 users have been added to the database');

      // Crear un escritor de CSV
      const csvWriter = createCsvWriter({
        path: 'C:/Users/Paco/Desktop/Faker/users.csv', // Cambia el path según tu ubicación deseada
        header: [
          { id: 'username', title: 'Username' },
          { id: 'email', title: 'Email' },
          { id: 'password', title: 'Password' },
          { id: 'telefono', title: 'Telefono' }
        ]
      });

      // Escribir los datos en un archivo CSV
      await csvWriter.writeRecords(users);
      console.log('Users have been written to CSV');
    } catch (error) {
      console.error('Error while seeding users:', error.message);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Opcional: Elimina los usuarios si es necesario
      await queryInterface.bulkDelete('users', null, {});
    } catch (error) {
      console.error('Error while deleting users:', error.message);
    }
  }
};

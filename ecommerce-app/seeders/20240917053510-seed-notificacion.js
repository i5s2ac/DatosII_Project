'use strict';

const faker = require('faker');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const notificaciones = [];
    const numNotificaciones = 10000; // Número de notificaciones a crear

    // Obtener IDs de usuarios existentes
    const usuarios = await queryInterface.rawSelect('users', {
      attributes: ['id'],
      where: {},
    }, ['id']);

    if (usuarios.length === 0) {
      throw new Error('No users found to associate notifications with.');
    }

    // Generar datos falsos para la tabla Notificaciones
    for (let i = 0; i < numNotificaciones; i++) {
      const estado = faker.random.arrayElement(['leída', 'no leída']);
      notificaciones.push({
        mensaje: faker.lorem.sentence(),
        fechaEnvio: faker.date.past(),
        estado: estado,
        usuarioId: faker.random.arrayElement(usuarios), // Seleccionar un usuario al azar
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // Insertar los datos en la base de datos
    await queryInterface.bulkInsert('notificaciones', notificaciones, {});

    console.log('Notificaciones have been added to the database');

    // Crear un archivo CSV con los datos generados
    const csvWriter = createCsvWriter({
      path: 'C:/Users/Paco/Desktop/Faker/notificaciones.csv', // Cambia el path según tu ubicación deseada
      header: [
        { id: 'mensaje', title: 'Mensaje' },
        { id: 'fechaEnvio', title: 'Fecha Envío' },
        { id: 'estado', title: 'Estado' },
        { id: 'usuarioId', title: 'Usuario ID' }
      ]
    });

    // Escribir los datos en el archivo CSV
    await csvWriter.writeRecords(notificaciones);
    console.log('Notificaciones have been written to CSV');
  },

  down: async (queryInterface, Sequelize) => {
    // Eliminar notificaciones si es necesario
    await queryInterface.bulkDelete('notificaciones', null, {});
  }
};

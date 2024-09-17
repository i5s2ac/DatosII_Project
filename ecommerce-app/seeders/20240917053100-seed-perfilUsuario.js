'use strict';

const faker = require('faker');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const perfilesUsuarios = [];
    const numPerfiles = 10000; // Número de perfiles a crear

    // Obtener IDs de usuarios para asignar
    const [users] = await queryInterface.sequelize.query('SELECT id FROM users');

    if (!users || users.length === 0) {
      throw new Error('No users found in the database');
    }

    // Generar datos falsos para la tabla perfil_usuarios
    for (let i = 0; i < numPerfiles; i++) {
      perfilesUsuarios.push({
        resumenProfesional: faker.lorem.paragraph(),
        ubicacion: faker.address.city(),
        fechaUltimaActualizacion: faker.date.past(),
        usuarioId: users[Math.floor(Math.random() * users.length)].id, // Selección aleatoria de usuarioId
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // Insertar los datos en la base de datos
    await queryInterface.bulkInsert('perfil_usuarios', perfilesUsuarios, {});

    console.log('Perfiles de usuarios have been added to the database');

    // Crear un archivo CSV con los datos generados
    const csvWriter = createCsvWriter({
      path: 'C:/Users/Paco/Desktop/Faker/perfiles_usuarios.csv', // Cambia el path según tu ubicación deseada
      header: [
        { id: 'resumenProfesional', title: 'Resumen Profesional' },
        { id: 'ubicacion', title: 'Ubicación' },
        { id: 'fechaUltimaActualizacion', title: 'Fecha Última Actualización' },
        { id: 'usuarioId', title: 'Usuario ID' }
      ]
    });

    // Escribir los datos en el archivo CSV
    await csvWriter.writeRecords(perfilesUsuarios);
    console.log('Perfiles de usuarios have been written to CSV');
  },

  down: async (queryInterface, Sequelize) => {
    // Eliminar perfiles de usuarios si es necesario
    await queryInterface.bulkDelete('perfil_usuarios', null, {});
  }
};

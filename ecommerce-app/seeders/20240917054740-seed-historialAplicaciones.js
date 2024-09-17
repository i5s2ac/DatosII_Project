'use strict';

const faker = require('faker');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const historialAplicaciones = [];
    const numAplicaciones = 10000; // Número de aplicaciones a crear

    // Obtener IDs de usuarios y ofertas de empleo existentes
    const usuarios = await queryInterface.rawSelect('users', {
      attributes: ['id'],
      where: {},
    }, ['id']);

    const ofertasEmpleos = await queryInterface.rawSelect('ofertas_empleos', {
      attributes: ['id'],
      where: {},
    }, ['id']);

    if (usuarios.length === 0 || ofertasEmpleos.length === 0) {
      throw new Error('No usuarios or ofertas_empleos found to associate applications with.');
    }

    // Generar datos falsos para la tabla Historial Aplicaciones
    for (let i = 0; i < numAplicaciones; i++) {
      historialAplicaciones.push({
        fechaAplicacion: faker.date.past(),
        estadoAplicacion: faker.random.arrayElement(['pendiente', 'en proceso', 'aceptada', 'rechazada']),
        usuarioId: faker.random.arrayElement(usuarios),
        ofertaEmpleoId: faker.random.arrayElement(ofertasEmpleos),
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // Insertar los datos en la base de datos
    await queryInterface.bulkInsert('historial_aplicaciones', historialAplicaciones, {});

    console.log('Historial de aplicaciones has been added to the database');

    // Crear un archivo CSV con los datos generados
    const csvWriter = createCsvWriter({
      path: 'C:/Users/Paco/Desktop/Faker/historial_aplicaciones.csv', // Cambia el path según tu ubicación deseada
      header: [
        { id: 'fechaAplicacion', title: 'Fecha Aplicacion' },
        { id: 'estadoAplicacion', title: 'Estado Aplicacion' },
        { id: 'usuarioId', title: 'Usuario ID' },
        { id: 'ofertaEmpleoId', title: 'Oferta Empleo ID' }
      ]
    });

    // Escribir los datos en el archivo CSV
    await csvWriter.writeRecords(historialAplicaciones);
    console.log('Historial de aplicaciones has been written to CSV');
  },

  down: async (queryInterface, Sequelize) => {
    // Eliminar historial de aplicaciones si es necesario
    await queryInterface.bulkDelete('historial_aplicaciones', null, {});
  }
};

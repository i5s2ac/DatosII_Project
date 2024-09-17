'use strict';

const faker = require('faker');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const candidatoOfertas = [];
    const numRegistros = 10000; // Número de registros a crear

    // Obtener IDs de usuarios existentes
    const usuarios = await queryInterface.rawSelect('users', {
      attributes: ['id'],
      where: {},
    }, ['id']);

    // Obtener IDs de ofertas de empleo existentes
    const ofertasEmpleo = await queryInterface.rawSelect('ofertas_empleos', {
      attributes: ['id'],
      where: {},
    }, ['id']);

    if (usuarios.length === 0 || ofertasEmpleo.length === 0) {
      throw new Error('No se encontraron usuarios o ofertas de empleo para asociar con los registros.');
    }

    // Generar datos falsos para la tabla Candidato_Oferta
    for (let i = 0; i < numRegistros; i++) {
      candidatoOfertas.push({
        estado: faker.random.arrayElement(['pendiente', 'en proceso', 'aceptada', 'rechazada']),
        usuarioId: faker.random.arrayElement(usuarios),
        ofertaEmpleoId: faker.random.arrayElement(ofertasEmpleo),
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // Insertar los datos en la base de datos
    await queryInterface.bulkInsert('Candidato_Oferta', candidatoOfertas, {});

    console.log('Datos de Candidato_Oferta han sido añadidos a la base de datos');

    // Crear un archivo CSV con los datos generados
    const csvWriter = createCsvWriter({
      path: 'C:/Users/Paco/Desktop/Faker/candidato_oferta.csv', // Cambia el path según tu ubicación deseada
      header: [
        { id: 'estado', title: 'Estado' },
        { id: 'usuarioId', title: 'Usuario ID' },
        { id: 'ofertaEmpleoId', title: 'Oferta Empleo ID' }
      ]
    });

    // Escribir los datos en el archivo CSV
    await csvWriter.writeRecords(candidatoOfertas);
    console.log('Datos de Candidato_Oferta han sido escritos en el CSV');
  },

  down: async (queryInterface, Sequelize) => {
    // Eliminar datos de Candidato_Oferta si es necesario
    await queryInterface.bulkDelete('Candidato_Oferta', null, {});
  }
};

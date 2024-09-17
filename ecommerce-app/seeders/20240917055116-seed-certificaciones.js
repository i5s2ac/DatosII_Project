'use strict';

const faker = require('faker');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const certificaciones = [];
      const numRegistros = 10000; // Número de registros a crear

      // Obtener IDs de todos los usuarios
      const usuarios = await queryInterface.sequelize.query(
          'SELECT id FROM users',
          { type: Sequelize.QueryTypes.SELECT }
      );

      if (!usuarios || usuarios.length === 0) {
        throw new Error('No se encontraron usuarios para asociar con los registros.');
      }

      // Generar datos falsos para la tabla certificaciones
      for (let i = 0; i < numRegistros; i++) {
        certificaciones.push({
          nombre: faker.lorem.words(3),
          organizacionEmisora: faker.company.companyName(),
          fechaObtencion: faker.date.past(10, new Date()).toISOString().split('T')[0], // Solo la fecha, sin tiempo
          descripcion: faker.lorem.sentence(),
          usuarioid: usuarios[Math.floor(Math.random() * usuarios.length)].id, // Selección aleatoria de usuarioId
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      // Insertar los datos en la base de datos
      await queryInterface.bulkInsert('certificaciones', certificaciones, {});

      console.log('Datos de certificaciones han sido añadidos a la base de datos');

      // Crear un archivo CSV con los datos generados
      const csvWriter = createCsvWriter({
        path: 'C:/Users/Paco/Desktop/Faker/certificaciones.csv', // Cambia el path según tu ubicación deseada
        header: [
          { id: 'nombre', title: 'Nombre' },
          { id: 'organizacionEmisora', title: 'Organización Emisora' },
          { id: 'fechaObtencion', title: 'Fecha de Obtención' },
          { id: 'descripcion', title: 'Descripción' },
          { id: 'usuarioid', title: 'Usuario ID' }
        ]
      });

      // Escribir los datos en el archivo CSV
      await csvWriter.writeRecords(certificaciones);
      console.log('Datos de certificaciones han sido escritos en el CSV');
    } catch (error) {
      console.error('Error while seeding certification data:', error.message);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Eliminar datos de certificaciones si es necesario
      await queryInterface.bulkDelete('certificaciones', null, {});
    } catch (error) {
      console.error('Error while deleting certification data:', error.message);
    }
  }
};

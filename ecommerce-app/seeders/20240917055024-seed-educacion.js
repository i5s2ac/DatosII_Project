'use strict';

const faker = require('faker');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const educacion = [];
      const numRegistros = 10000; // Número de registros a crear

      // Obtener IDs de todos los usuarios
      const usuarios = await queryInterface.sequelize.query(
          'SELECT id FROM users',
          { type: Sequelize.QueryTypes.SELECT }
      );

      if (!usuarios || usuarios.length === 0) {
        throw new Error('No se encontraron usuarios para asociar con los registros.');
      }

      // Generar datos falsos para la tabla educacion
      for (let i = 0; i < numRegistros; i++) {
        educacion.push({
          institucion: faker.company.companyName(),
          gradoObtenido: faker.lorem.word(),
          campoEstudio: faker.lorem.word(),
          fechaInicio: faker.date.past(10, new Date()).toISOString().split('T')[0], // Solo la fecha, sin tiempo
          fechaFin: faker.date.past(5, new Date()).toISOString().split('T')[0], // Solo la fecha, sin tiempo
          usuarioid: usuarios[Math.floor(Math.random() * usuarios.length)].id, // Selección aleatoria de usuarioId
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      // Insertar los datos en la base de datos
      await queryInterface.bulkInsert('educacion', educacion, {});

      console.log('Datos de educacion han sido añadidos a la base de datos');

      // Crear un archivo CSV con los datos generados
      const csvWriter = createCsvWriter({
        path: 'C:/Users/Paco/Desktop/Faker/educacion.csv', // Cambia el path según tu ubicación deseada
        header: [
          { id: 'institucion', title: 'Institución' },
          { id: 'gradoObtenido', title: 'Grado Obtenido' },
          { id: 'campoEstudio', title: 'Campo de Estudio' },
          { id: 'fechaInicio', title: 'Fecha de Inicio' },
          { id: 'fechaFin', title: 'Fecha de Fin' },
          { id: 'usuarioid', title: 'Usuario ID' }
        ]
      });

      // Escribir los datos en el archivo CSV
      await csvWriter.writeRecords(educacion);
      console.log('Datos de educacion han sido escritos en el CSV');
    } catch (error) {
      console.error('Error while seeding education data:', error.message);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Eliminar datos de educación si es necesario
      await queryInterface.bulkDelete('educacion', null, {});
    } catch (error) {
      console.error('Error while deleting education data:', error.message);
    }
  }
};

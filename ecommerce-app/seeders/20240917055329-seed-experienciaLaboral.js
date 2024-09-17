'use strict';

const faker = require('faker');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const experienciaLaboral = [];
      const numRegistros = 10000; // Número de registros a crear

      // Obtener IDs de usuarios existentes
      const usuarios = await queryInterface.sequelize.query(
          'SELECT id FROM users',
          { type: Sequelize.QueryTypes.SELECT }
      );

      if (!usuarios || usuarios.length === 0) {
        throw new Error('No se encontraron usuarios para asociar con los registros.');
      }

      // Generar datos falsos para la tabla experiencia_laboral
      for (let i = 0; i < numRegistros; i++) {
        experienciaLaboral.push({
          usuarioid: usuarios[Math.floor(Math.random() * usuarios.length)].id, // Selección aleatoria de usuarioId
          titulo_puesto: faker.name.jobTitle(), // Cambiado de faker.job.title() a faker.name.jobTitle()
          empresa: faker.company.companyName(),
          ubicacion: faker.address.city(),
          fecha_inicio: faker.date.past(5, new Date()).toISOString().split('T')[0], // Solo la fecha, sin tiempo
          fecha_fin: faker.date.recent(1, new Date()).toISOString().split('T')[0], // Solo la fecha, sin tiempo
          descripcion: faker.lorem.paragraph(),
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      // Insertar los datos en la base de datos
      await queryInterface.bulkInsert('experiencia_laboral', experienciaLaboral, {});

      console.log('Datos de experiencia_laboral han sido añadidos a la base de datos');

      // Crear un archivo CSV con los datos generados
      const csvWriter = createCsvWriter({
        path: 'C:/Users/Paco/Desktop/Faker/experiencia_laboral.csv', // Cambia el path según tu ubicación deseada
        header: [
          { id: 'usuarioid', title: 'Usuario ID' },
          { id: 'titulo_puesto', title: 'Título Puesto' },
          { id: 'empresa', title: 'Empresa' },
          { id: 'ubicacion', title: 'Ubicación' },
          { id: 'fecha_inicio', title: 'Fecha Inicio' },
          { id: 'fecha_fin', title: 'Fecha Fin' },
          { id: 'descripcion', title: 'Descripción' }
        ]
      });

      // Escribir los datos en el archivo CSV
      await csvWriter.writeRecords(experienciaLaboral);
      console.log('Datos de experiencia_laboral han sido escritos en el CSV');
    } catch (error) {
      console.error('Error while seeding experience labor data:', error.message);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Eliminar datos de experiencia_laboral si es necesario
      await queryInterface.bulkDelete('experiencia_laboral', null, {});
    } catch (error) {
      console.error('Error while deleting experience labor data:', error.message);
    }
  }
};


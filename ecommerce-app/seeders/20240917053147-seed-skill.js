'use strict';

const faker = require('faker');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const skills = [];
      const numSkills = 10000; // Número de habilidades a crear

      // Obtener IDs de usuarios para asignar
      const users = await queryInterface.sequelize.query(
          'SELECT id FROM users',
          { type: Sequelize.QueryTypes.SELECT }
      );

      if (!users || users.length === 0) {
        throw new Error('No users found in the database to assign skills.');
      }

      // Generar datos falsos para la tabla Skills
      for (let i = 0; i < numSkills; i++) {
        const nivelDominio = faker.helpers.randomize(['básico', 'intermedio', 'avanzado', 'experto']);
        skills.push({
          nombre: faker.lorem.word(),
          nivelDominio: nivelDominio,
          descripcion: faker.lorem.sentence(),
          usuarioId: users[Math.floor(Math.random() * users.length)].id, // Selección aleatoria de usuarioId
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      // Insertar los datos en la base de datos
      await queryInterface.bulkInsert('Skills', skills, {});
      console.log('Skills have been added to the database');

      // Crear un archivo CSV con los datos generados
      const csvWriter = createCsvWriter({
        path: 'C:/Users/Paco/Desktop/Faker/skills.csv', // Cambia el path según tu ubicación deseada
        header: [
          { id: 'nombre', title: 'Nombre' },
          { id: 'nivelDominio', title: 'Nivel Dominio' },
          { id: 'descripcion', title: 'Descripción' },
          { id: 'usuarioId', title: 'Usuario ID' }
        ]
      });

      // Escribir los datos en el archivo CSV
      await csvWriter.writeRecords(skills);
      console.log('Skills have been written to CSV');
    } catch (error) {
      console.error('Error while seeding skills:', error.message);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Eliminar skills si es necesario
      await queryInterface.bulkDelete('Skills', null, {});
    } catch (error) {
      console.error('Error while deleting skills:', error.message);
    }
  }
};

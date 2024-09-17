'use strict';

const faker = require('faker');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const ofertasEmpleo = [];
      const numOfertas = 1000; // Número de ofertas a crear

      // Obtener IDs de empresas y usuarios para asignar
      const empresas = await queryInterface.sequelize.query(
          'SELECT id FROM empresas',
          { type: Sequelize.QueryTypes.SELECT }
      );

      const users = await queryInterface.sequelize.query(
          'SELECT id FROM users',
          { type: Sequelize.QueryTypes.SELECT }
      );

      // Verificar si existen empresas y usuarios
      if (!empresas || empresas.length === 0) {
        throw new Error('No companies found in the database to assign job offers.');
      }

      if (!users || users.length === 0) {
        throw new Error('No users found in the database to assign job offers.');
      }

      // Generar datos falsos para la tabla OfertaEmpleo
      for (let i = 0; i < numOfertas; i++) {
        ofertasEmpleo.push({
          titulo: faker.name.jobTitle(),
          descripcion: faker.lorem.sentence(),
          ubicacion: faker.address.city(),
          salario: faker.finance.amount(30000, 100000, 2), // Eliminar el símbolo '$'
          fechaPublicacion: faker.date.past(),
          fechaCierre: faker.date.future(),
          empresaId: empresas[Math.floor(Math.random() * empresas.length)].id, // Selección aleatoria de empresaId
          userId: users[Math.floor(Math.random() * users.length)].id, // Selección aleatoria de userId
          estatus: 'Activo',
          tags: faker.random.words(3).split(' ').join(','), // Ejemplo de 3 tags separados por comas
          modalidad: faker.helpers.randomize(['Presencial', 'Remoto', 'Híbrido']),
          tipoTrabajo: faker.helpers.randomize(['Tiempo Completo', 'Medio Tiempo']),
          Funciones_Requerimiento: faker.lorem.words(5),
          Estudios_Requerimiento: faker.lorem.words(3),
          Experiencia_Requerimiento: faker.lorem.words(4),
          Conocimientos_Requerimiento: faker.lorem.words(4),
          Competencias__Requerimiento: faker.lorem.words(4),
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      // Insertar los datos en la base de datos
      await queryInterface.bulkInsert('ofertas_empleos', ofertasEmpleo, {});
      console.log('Ofertas de empleo han sido añadidas a la base de datos');

      // Crear un archivo CSV con los datos generados
      const csvWriter = createCsvWriter({
        path: 'C:/Users/Paco/Desktop/Faker/ofertasEmpleo.csv', // Cambia el path según tu ubicación deseada
        header: [
          { id: 'titulo', title: 'Título' },
          { id: 'descripcion', title: 'Descripción' },
          { id: 'ubicacion', title: 'Ubicación' },
          { id: 'salario', title: 'Salario' },
          { id: 'empresaId', title: 'ID Empresa' },
          { id: 'userId', title: 'ID Usuario' }
        ]
      });

      // Escribir los datos en el archivo CSV
      await csvWriter.writeRecords(ofertasEmpleo);
      console.log('Ofertas de empleo han sido escritas en el archivo CSV');
    } catch (error) {
      console.error('Error while seeding job offers:', error.message);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Eliminar ofertas de empleo si es necesario
      await queryInterface.bulkDelete('ofertas_empleos', null, {});
    } catch (error) {
      console.error('Error while deleting job offers:', error.message);
    }
  }
};

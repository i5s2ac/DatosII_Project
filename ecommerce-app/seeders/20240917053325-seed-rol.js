'use strict';

const createCsvWriter = require('csv-writer').createObjectCsvWriter;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Crear el rol Admin
    const roles = [
      {
        nombre: 'Admin',
        descripcion: 'Rol con todos los permisos',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Insertar el rol en la base de datos
    await queryInterface.bulkInsert('roles', roles, {});
    console.log('Role Admin has been added to the database');

    // Crear un archivo CSV con los datos generados
    const csvWriter = createCsvWriter({
      path: 'C:/Users/Paco/Desktop/Faker/roles.csv', // Cambia el path según tu ubicación deseada
      header: [
        { id: 'nombre', title: 'Nombre' },
        { id: 'descripcion', title: 'Descripción' }
      ]
    });

    // Escribir los datos en el archivo CSV
    await csvWriter.writeRecords(roles);
    console.log('Role Admin has been written to CSV');
  },

  down: async (queryInterface, Sequelize) => {
    // Eliminar roles si es necesario
    await queryInterface.bulkDelete('roles', null, {});
  }
};

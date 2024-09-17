'use strict';

const faker = require('faker');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const empresaUsuario = [];
    const numRegistros = 10000; // Número de registros a crear

    // Obtener IDs de empresas, usuarios y roles existentes
    const empresas = await queryInterface.rawSelect('empresas', {
      attributes: ['id'],
      where: {},
    }, ['id']);

    const usuarios = await queryInterface.rawSelect('users', {
      attributes: ['id'],
      where: {},
    }, ['id']);

    const roles = await queryInterface.rawSelect('roles', {
      attributes: ['id'],
      where: {},
    }, ['id']);

    if (empresas.length === 0 || usuarios.length === 0 || roles.length === 0) {
      throw new Error('No empresas, usuarios, or roles found to associate records with.');
    }

    // Generar datos falsos para la tabla empresa_usuario
    for (let i = 0; i < numRegistros; i++) {
      empresaUsuario.push({
        empresaId: faker.random.arrayElement(empresas),
        usuarioId: faker.random.arrayElement(usuarios),
        rolId: faker.random.arrayElement(roles),
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // Insertar los datos en la base de datos
    await queryInterface.bulkInsert('empresa_usuario', empresaUsuario, {});

    console.log('Datos de empresa_usuario han sido añadidos a la base de datos');

    // Crear un archivo CSV con los datos generados
    const csvWriter = createCsvWriter({
      path: 'C:/Users/Paco/Desktop/Faker/empresa_usuario.csv', // Cambia el path según tu ubicación deseada
      header: [
        { id: 'empresaId', title: 'Empresa ID' },
        { id: 'usuarioId', title: 'Usuario ID' },
        { id: 'rolId', title: 'Rol ID' }
      ]
    });

    // Escribir los datos en el archivo CSV
    await csvWriter.writeRecords(empresaUsuario);
    console.log('Datos de empresa_usuario han sido escritos en el CSV');
  },

  down: async (queryInterface, Sequelize) => {
    // Eliminar datos de empresa_usuario si es necesario
    await queryInterface.bulkDelete('empresa_usuario', null, {});
  }
};

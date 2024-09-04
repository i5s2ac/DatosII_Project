'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Aquí agregas los comandos para insertar los datos en la tabla "industrias"
    await queryInterface.bulkInsert('Industrias', [
      { nombre: 'Tecnología', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Salud', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Finanzas', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Educación', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Manufactura', createdAt: new Date(), updatedAt: new Date() },
      // Añade más datos según sea necesario
    ], {});
  },

  async down (queryInterface, Sequelize) {
    // Aquí agregas los comandos para eliminar los datos de la tabla "industrias" si es necesario
    await queryInterface.bulkDelete('Industrias', null, {});
  }
};

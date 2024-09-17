'use strict';

const faker = require('faker');
const bcrypt = require('bcryptjs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = [];
    const empresas = [];
    const roles = [];
    const empresaUsuarios = [];

    for (let i = 0; i < 1000; i++) {
      const password = faker.internet.password();
      const hashedPassword = await bcrypt.hash(password, 10);

      const username = faker.internet.userName();
      const email = faker.internet.email();
      const phone = faker.phone.phoneNumber();
      const companyName = faker.company.companyName();
      const direccion = faker.address.streetAddress();
      const descripcion = faker.company.catchPhrase();
      const sitioWeb = faker.internet.url();

      // Crear usuarios
      users.push({
        username: username,
        email: email,
        password: hashedPassword,
        telefono: phone,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Crear empresas
      empresas.push({
        nombre: companyName,
        direccion: direccion,
        telefono: phone,
        email: email,
        descripcion: descripcion,
        sitioWeb: sitioWeb,
        industriaId: 1,  // Valor por defecto para industriaId
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Asignar roles (por simplicidad creamos un solo rol de Admin)
      if (i === 0) {
        roles.push({
          nombre: 'Admin',
          descripcion: 'Administrator of the company',
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }

    // Inserta los usuarios en la base de datos
    await queryInterface.bulkInsert('users', users, {});

    // Inserta las empresas en la base de datos
    await queryInterface.bulkInsert('empresas', empresas, {});

    // Inserta roles si no existen
    const existingRole = await queryInterface.rawSelect('roles', {
      where: { nombre: 'Admin' },
    }, ['id']);
    if (!existingRole) {
      await queryInterface.bulkInsert('roles', roles, {});
    }

    // Crear relaciones entre usuarios y empresas
    for (let i = 0; i < users.length; i++) {
      empresaUsuarios.push({
        empresaId: i + 1,  // Suponiendo que empresaId y usuarioId corresponden al mismo índice
        usuarioId: i + 1,
        rolId: 1,  // Suponiendo que el rol de Admin es el primero
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // Inserta las relaciones en EmpresaUsuario
    await queryInterface.bulkInsert('empresa-usuario', empresaUsuarios, {});

    console.log('1000 users and companies have been added to the database');

    // Crear un archivo CSV con los datos generados
    const csvWriter = createCsvWriter({
      path: 'C:/Users/Paco/Desktop/Faker/users_and_companies.csv', // Cambia el path según tu ubicación deseada
      header: [
        { id: 'username', title: 'Username' },
        { id: 'email', title: 'Email' },
        { id: 'password', title: 'Password' },
        { id: 'phone', title: 'Phone' },
        { id: 'companyName', title: 'Company Name' },
        { id: 'direccion', title: 'Address' },
        { id: 'descripcion', title: 'Description' },
        { id: 'sitioWeb', title: 'Website' }
      ]
    });

    // Escribir los datos en el archivo CSV
    const csvData = users.map((user, index) => ({
      username: user.username,
      email: user.email,
      password: user.password, // Esto es el password hasheado
      phone: user.telefono,
      companyName: empresas[index].nombre,
      direccion: empresas[index].direccion,
      descripcion: empresas[index].descripcion,
      sitioWeb: empresas[index].sitioWeb
    }));

    await csvWriter.writeRecords(csvData);
    console.log('Users and companies have been written to CSV');
  },

  down: async (queryInterface, Sequelize) => {
    // Eliminar usuarios, empresas y relaciones si es necesario
    await queryInterface.bulkDelete('empresa_usuario', null, {});
    await queryInterface.bulkDelete('empresas', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};

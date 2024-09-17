'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('industrias', [
      { nombre: 'Tecnología', descripcion: 'Sector dedicado al desarrollo y aplicación de tecnología.', codigo: 'TEC', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Salud', descripcion: 'Sector enfocado en la atención y mejora de la salud.', codigo: 'SAL', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Finanzas', descripcion: 'Sector dedicado a la gestión de dinero y activos.', codigo: 'FIN', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Educación', descripcion: 'Sector enfocado en la enseñanza y el aprendizaje.', codigo: 'EDU', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Energía', descripcion: 'Sector relacionado con la producción y distribución de energía.', codigo: 'ENE', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Transporte', descripcion: 'Sector dedicado al movimiento de personas y mercancías.', codigo: 'TRA', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Construcción', descripcion: 'Sector enfocado en la construcción de infraestructuras y edificaciones.', codigo: 'CON', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Agricultura', descripcion: 'Sector relacionado con el cultivo de plantas y la crianza de animales.', codigo: 'AGR', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Turismo', descripcion: 'Sector dedicado a la organización y gestión de viajes y turismo.', codigo: 'TUR', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Retail', descripcion: 'Sector enfocado en la venta de productos al por menor.', codigo: 'RET', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Telecomunicaciones', descripcion: 'Sector relacionado con la transmisión de información a través de medios electrónicos.', codigo: 'TEL', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Entretenimiento', descripcion: 'Sector dedicado a actividades recreativas y de ocio.', codigo: 'ENT', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Medios de Comunicación', descripcion: 'Sector relacionado con la producción y distribución de noticias y entretenimiento.', codigo: 'MED', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Seguros', descripcion: 'Sector enfocado en la provisión de seguros y gestión de riesgos.', codigo: 'SEG', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Servicios Públicos', descripcion: 'Sector relacionado con la provisión de servicios esenciales como agua y electricidad.', codigo: 'SER', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Automotriz', descripcion: 'Sector dedicado a la fabricación y venta de vehículos.', codigo: 'AUT', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Inmobiliaria', descripcion: 'Sector relacionado con la compra, venta y alquiler de bienes inmuebles.', codigo: 'INM', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Farmacéutico', descripcion: 'Sector enfocado en la investigación, desarrollo y comercialización de medicamentos.', codigo: 'FAR', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Química', descripcion: 'Sector dedicado a la producción y comercialización de productos químicos.', codigo: 'QUI', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Moda', descripcion: 'Sector relacionado con el diseño, fabricación y comercialización de ropa y accesorios.', codigo: 'MOD', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Biotecnología', descripcion: 'Sector dedicado a la aplicación de tecnología en la biología y ciencias de la vida.', codigo: 'BIO', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Gastronomía', descripcion: 'Sector enfocado en la preparación y servicio de alimentos y bebidas.', codigo: 'GAS', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Aeroespacial', descripcion: 'Sector relacionado con la fabricación y desarrollo de aeronaves y sistemas espaciales.', codigo: 'AER', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Logística', descripcion: 'Sector dedicado a la gestión de la cadena de suministro y transporte de mercancías.', codigo: 'LOG', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Servicios Legales', descripcion: 'Sector enfocado en la provisión de servicios jurídicos y legales.', codigo: 'LEG', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Arquitectura', descripcion: 'Sector dedicado al diseño y planificación de edificaciones y espacios.', codigo: 'ARC', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Salud Mental', descripcion: 'Sector enfocado en el bienestar mental y emocional de las personas.', codigo: 'SAL-M', createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('industrias', null, {});
  }
};


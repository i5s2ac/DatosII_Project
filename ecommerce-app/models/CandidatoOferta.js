// models/CandidatoOferta.js
import { DataTypes } from 'sequelize';
const sequelize = require('../src/lib/sequelize');
import User from './user';  // Asegúrate de que User.js use export default
import OfertaEmpleo from './ofertaempleo';  // Asegúrate de que OfertaEmpleo.js use export default

const CandidatoOferta = sequelize.define('CandidatoOferta', {
    estado: {
        type: DataTypes.ENUM('pendiente', 'en proceso', 'aceptada', 'rechazada'),
        allowNull: false,
    },
    usuarioId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    ofertaEmpleoId: {
        type: DataTypes.INTEGER,
        references: {
            model: OfertaEmpleo,
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
}, {
    timestamps: true,
    tableName: 'Candidato_Oferta',
});

export default CandidatoOferta;

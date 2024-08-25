import { DataTypes } from 'sequelize';
import sequelize from '../lib/sequelize';
const User = require('./User');
const OfertaEmpleo = require('./OfertaEmpleo');

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
    tableName: 'Candidato_Oferta'
});

export default CandidatoOferta;

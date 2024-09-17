import { DataTypes } from 'sequelize';
import sequelize from '../src/lib/sequelize';
import OfertaEmpleo from './ofertaempleo'; // Mantén las importaciones directas que no causan ciclos

const CandidatoOferta = sequelize.define('CandidatoOferta', {
    estado: {
        type: DataTypes.ENUM('pendiente', 'en proceso', 'aceptada', 'rechazada'),
        allowNull: false,
    },
    usuarioId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'User',  // Usamos el nombre del modelo como referencia para evitar el ciclo aquí
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

// Usamos una importación dinámica para asociar el modelo `User` y evitar ciclos
CandidatoOferta.belongsTo(sequelize.models.User, { foreignKey: 'usuarioId', as: 'candidato' });
CandidatoOferta.belongsTo(OfertaEmpleo, { foreignKey: 'ofertaEmpleoId', as: 'ofertaEmpleo' });

export default CandidatoOferta;

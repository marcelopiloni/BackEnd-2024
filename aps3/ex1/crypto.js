import { DataTypes } from 'sequelize';
import sequelize from './db.js';

const Crypto = sequelize.define('Crypto', {
    moeda: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sigla: {
        type: DataTypes.STRING,
        allowNull: false
    },
    preco: {
        type: DataTypes.DECIMAL(20, 8),
        allowNull: false
    },
    dataConsulta: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

export default Crypto;
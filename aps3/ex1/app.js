// index.js
import express from "express";
import axios from 'axios';
import dotenv from 'dotenv';
import {cliente, conectarRedis} from './redisClient.js';
import sequelize from './db.js';
import Crypto from './crypto.js';

dotenv.config();

const app = express();
const PORTA = process.env.PORTA || 3000;

// Conectar ao Redis e ao banco de dados
conectarRedis();
sequelize.sync();

// Rota para buscar preço de criptomoeda por ID
app.get('/crypto/:id', async(req, res) => {
    const cryptoId = req.params.id.toLowerCase(); 

    // Tentar buscar os dados do cache
    try {
        const dadosCache = await cliente.get(cryptoId);
        if (dadosCache) {
            return res.json(JSON.parse(dadosCache));
        }
    } catch(error) {
        console.error('Erro ao acessar o cache:', error);
    }

    // Se não estiver no cache, requisitar à API do CoinGecko
    try {
        const resposta = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${cryptoId}&vs_currencies=usd`);
        

        // Buscar informações adicionais para obter o símbolo (sigla)
        const infoMoeda = await axios.get(`https://api.coingecko.com/api/v3/coins/${cryptoId}`);
        
        const dadosCrypto = {
            moeda: infoMoeda.data.name,
            sigla: infoMoeda.data.symbol.toUpperCase(),
            preco: resposta.data[cryptoId].usd,
            dataConsulta: new Date()
        }

        // Armazenar no banco de dados
        await Crypto.create(dadosCrypto);

        // Armazenar no cache (Redis)
        await cliente.setEx(cryptoId, 300, JSON.stringify(dadosCrypto)); // Cache por 5 minutos

        res.json(dadosCrypto);
    } catch(error) {
        console.error('Erro ao buscar dados da criptomoeda:', error);
        res.status(500).json({message: 'Erro ao buscar dados da criptomoeda', erro: error.message});
    }
});

// Nova rota para buscar preço por nome da criptomoeda
app.get('/preco/:nome', async(req, res) => {
    const nomeMoeda = req.params.nome.toLowerCase();
    const cacheKey = `nome:${nomeMoeda}`;

    // Tentar buscar os dados do cache
    try {
        const dadosCache = await cliente.get(cacheKey);
        if (dadosCache) {
            const dados = JSON.parse(dadosCache);
            return res.json({
                ...dados,
                fonte: 'cache'
            });
        }
    } catch(error) {
        console.error('Erro ao acessar o cache:', error);
    }

    // Se não estiver no cache, requisitar à API do CoinGecko
    try {
        const resposta = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${nomeMoeda}&vs_currencies=usd`);
        
        // Verificar se a moeda foi encontrada
        if (!resposta.data[nomeMoeda]) {
            return res.status(404).json({
                message: 'Criptomoeda não encontrada',
                sugestao: 'Use o nome como aparece no CoinGecko (ex: bitcoin, ethereum)'
            });
        }

        // Buscar informações adicionais
        const infoMoeda = await axios.get(`https://api.coingecko.com/api/v3/coins/${nomeMoeda}`);
        
        const dadosCrypto = {
            moeda: infoMoeda.data.name,
            sigla: infoMoeda.data.symbol.toUpperCase(),
            preco: resposta.data[nomeMoeda].usd,
            dataConsulta: new Date()
        };

        // Armazenar no banco de dados
        await Crypto.create(dadosCrypto);

        // Armazenar no cache (Redis)
        await cliente.setEx(cacheKey, 300, JSON.stringify(dadosCrypto)); // Cache por 5 minutos

        res.json({
            ...dadosCrypto,
            fonte: 'api'
        });
    } catch(error) {
        console.error('Erro ao buscar dados da criptomoeda:', error);
        res.status(500).json({message: 'Erro ao buscar dados da criptomoeda', erro: error.message});
    }
});


// Iniciar a aplicação
app.listen(PORTA, () => {
    console.log(`Servidor rodando em: http://localhost:${PORTA}`);
});
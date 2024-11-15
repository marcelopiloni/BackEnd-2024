// translationService.js
import { cliente as redis } from './redis.js';
import Translation from './Translation.js';
import axios from 'axios';

class TranslationService {
    static async translate(text, targetLanguage) {
        try {
            // Verificar cache
            const cacheKey = `translation:${text}:${targetLanguage}`;
            const cachedTranslation = await redis.get(cacheKey);
            
            if (cachedTranslation) {
                console.log('Tradução encontrada no cache');
                return JSON.parse(cachedTranslation);
            }

            // Tradução via Azure
            const endpoint = `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=${targetLanguage}`;
            
            const response = await axios({
                baseURL: endpoint,
                method: 'post',
                headers: {
                    'Ocp-Apim-Subscription-Key': process.env.AZURE_TRANSLATION_KEY,
                    'Ocp-Apim-Subscription-Region': process.env.AZURE_TRANSLATION_REGION,
                    'Content-type': 'application/json',
                },
                data: [{
                    'text': text
                }]
            });

            const translatedText = response.data[0].translations[0].text;
            
            // Salvar no banco de dados
            const id = await Translation.create(text, translatedText, targetLanguage);
            
            const result = {
                id,
                textoOriginal: text,
                textoTraduzido: translatedText,
                idioma: targetLanguage
            };

            // Salvar no cache
            await redis.set(cacheKey, JSON.stringify(result), {
                EX: 900 // 15 minutos
            });
            
            return result;
        } catch (error) {
            throw new Error(`Erro na tradução: ${error.message}`);
        }
    }
}

export default TranslationService;
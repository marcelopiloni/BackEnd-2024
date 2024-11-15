import TranslationService from './translationService.js';
import Translation from './Translation.js';

class TranslationController {
    static async translate(req, res) {
        try {
            const { text, targetLanguage } = req.body;
            
            if (!text || !targetLanguage) {
                return res.status(400).json({ error: 'Texto e idioma de destino são obrigatórios' });
            }

            const result = await TranslationService.translate(text, targetLanguage);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const translation = await Translation.findById(req.params.id);
            
            if (!translation) {
                return res.status(404).json({ error: 'Tradução não encontrada' });
            }
            
            res.json(translation);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getAll(req, res) {
        try {
            const translations = await Translation.findAll();
            res.json(translations);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default TranslationController;
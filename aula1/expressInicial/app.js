// Configurações
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Configurar EJS como motor de template
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Servir os arquivos estáticos (pasta pública)
app.use(express.static(path.join(__dirname, 'public')));

//Rota inicial (index)
app.get('/', (req, res) => {
    const message = 'Imposto sobre fundos imobiliários é crime!';
    res.render('index', {message});
    
});


//Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rotando em http://localhost:${port}`);




});

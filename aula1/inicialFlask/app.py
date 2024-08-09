# Biblioteca e módulo
from flask import Flask, render_template

# Instância do app
app = Flask(__name__, template_folder='templates', 
            static_folder='static')

#Rota inicial
@app.route("/")
def index():
    message = "Botão do Marcelo"
    return render_template('index.html', message = message)

#Rota teste
@app.route("/textor")
def textor():
    return '<h1> Athletico maior do Paraná</h1>'

#Iniciar a aplicação
if __name__ == '__main__':
    app.run(debug = True)
    
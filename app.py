from flask import Flask, render_template, request, jsonify
from database import get_db, load_initial_data

app = Flask(__name__)

# Load initial data from CSV files when the application starts
load_initial_data()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/aulas', methods=['GET', 'POST'])
def aulas():
    db = get_db()
    if request.method == 'GET':
        cursor = db.execute("SELECT id, escola, turno, turma, num_aulas, professor FROM aulas ORDER BY escola, turno, turma")
        aulas_list = [dict(row) for row in cursor.fetchall()]
        return jsonify(aulas_list)
    elif request.method == 'POST':
        data = request.get_json()
        escola = data.get('escola')
        turno = data.get('turno')
        turma = data.get('turma')
        num_aulas = data.get('num_aulas')
        professor = data.get('professor')
        
        db.execute("INSERT INTO aulas (escola, turno, turma, num_aulas, professor) VALUES (?, ?, ?, ?, ?)",
                   (escola, turno, turma, num_aulas, professor))
        db.commit()
        return jsonify({"message": "Aula adicionada com sucesso!"}), 201

@app.route('/api/aulas/<int:id>', methods=['PUT', 'DELETE'])
def gerenciar_aula(id):
    db = get_db()
    if request.method == 'PUT':
        data = request.get_json()
        escola = data.get('escola')
        turno = data.get('turno')
        turma = data.get('turma')
        num_aulas = data.get('num_aulas')
        professor = data.get('professor')
        
        db.execute("UPDATE aulas SET escola=?, turno=?, turma=?, num_aulas=?, professor=? WHERE id=?",
                   (escola, turno, turma, num_aulas, professor, id))
        db.commit()
        return jsonify({"message": "Aula atualizada com sucesso!"})
    elif request.method == 'DELETE':
        db.execute("DELETE FROM aulas WHERE id=?", (id,))
        db.commit()
        return jsonify({"message": "Aula excluída com sucesso!"})

@app.route('/api/resumo', methods=['GET'])
def resumo():
    db = get_db()
    
    # Resumo 1: Total de aulas por professor
    cursor = db.execute('''
        SELECT professor, SUM(num_aulas) as total_aulas
        FROM aulas
        WHERE professor != 'NÃO ATRIBUÍDO'
        GROUP BY professor
        ORDER BY total_aulas DESC
    ''')
    aulas_por_professor = [dict(row) for row in cursor.fetchall()]
    
    # Resumo 2: Escolas com aulas sem professor
    cursor = db.execute('''
        SELECT DISTINCT escola, COUNT(turma) as total_turmas
        FROM aulas
        WHERE professor = 'NÃO ATRIBUÍDO'
        GROUP BY escola
        ORDER BY escola
    ''')
    escolas_sem_professor = [dict(row) for row in cursor.fetchall()]
    
    return jsonify({
        "aulas_por_professor": aulas_por_professor,
        "escolas_sem_professor": escolas_sem_professor
    })

if __name__ == '__main__':
    app.run(debug=True)
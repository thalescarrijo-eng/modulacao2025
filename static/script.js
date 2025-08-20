document.addEventListener('DOMContentLoaded', () => {
    loadData();
    loadSummary();
});

let currentEditingId = null;

function loadData() {
    fetch('/api/aulas')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#aulas-table tbody');
            tableBody.innerHTML = '';
            data.forEach(aula => {
                const row = `
                    <tr data-id="${aula.id}">
                        <td>${aula.escola}</td>
                        <td>${aula.turno}</td>
                        <td>${aula.turma}</td>
                        <td>${aula.num_aulas}</td>
                        <td>${aula.professor}</td>
                        <td>
                            <button class="edit-button" onclick="editAula(${aula.id})">Editar</button>
                            <button class="delete-button" onclick="deleteAula(${aula.id})">Excluir</button>
                        </td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });
        });
}

function loadSummary() {
    fetch('/api/resumo')
        .then(response => response.json())
        .then(data => {
            const resumoDiv = document.getElementById('resumo');
            resumoDiv.innerHTML = '';
            
            // Resumo de Aulas por Professor
            let aulasPorProfHTML = '<h3>Total de Aulas por Professor</h3><ul>';
            data.aulas_por_professor.forEach(prof => {
                aulasPorProfHTML += `<li><strong>${prof.professor}</strong>: ${prof.total_aulas} aulas</li>`;
            });
            aulasPorProfHTML += '</ul>';
            resumoDiv.innerHTML += aulasPorProfHTML;

            // Resumo de Escolas sem Professor
            let escolasSemProfHTML = '<h3>Escolas com Aulas Sem Professor Atribuído</h3><ul>';
            if (data.escolas_sem_professor.length > 0) {
                data.escolas_sem_professor.forEach(escola => {
                    escolasSemProfHTML += `<li><strong>${escola.escola}</strong>: ${escola.total_turmas} turmas sem professor</li>`;
                });
            } else {
                escolasSemProfHTML += `<li>Nenhuma turma sem professor encontrada.</li>`;
            }
            escolasSemProfHTML += '</ul>';
            resumoDiv.innerHTML += escolasSemProfHTML;
        });
}

function openModal(id = null) {
    const modal = document.getElementById('aula-modal');
    modal.style.display = 'flex';
    document.getElementById('aula-form').reset();
    currentEditingId = null;
    
    if (id) {
        currentEditingId = id;
        document.getElementById('modal-title').innerText = 'Editar Aula';
        document.getElementById('save-button').innerText = 'Salvar Alterações';
        
        fetch(`/api/aulas`)
            .then(response => response.json())
            .then(data => {
                const aula = data.find(a => a.id === id);
                if (aula) {
                    document.getElementById('aula-id').value = aula.id;
                    document.getElementById('escola').value = aula.escola;
                    document.getElementById('turno').value = aula.turno;
                    document.getElementById('turma').value = aula.turma;
                    document.getElementById('num_aulas').value = aula.num_aulas;
                    document.getElementById('professor').value = aula.professor;
                }
            });
    } else {
        document.getElementById('modal-title').innerText = 'Adicionar Nova Aula';
        document.getElementById('save-button').innerText = 'Adicionar';
    }
}

function closeModal() {
    document.getElementById('aula-modal').style.display = 'none';
    currentEditingId = null;
}

document.getElementById('aula-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    data.num_aulas = parseInt(data.num_aulas);
    
    const method = currentEditingId ? 'PUT' : 'POST';
    const url = currentEditingId ? `/api/aulas/${currentEditingId}` : '/api/aulas';
    
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(() => {
        closeModal();
        loadData();
        loadSummary();
    });
});

function editAula(id) {
    openModal(id);
}

function deleteAula(id) {
    if (confirm('Tem certeza que deseja excluir esta aula?')) {
        fetch(`/api/aulas/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(() => {
            loadData();
            loadSummary();
        });
    }
}

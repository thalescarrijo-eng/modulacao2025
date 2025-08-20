# Sistema de Gerenciamento de Aulas de Educação Física - Mineiros

Este é um sistema prático e funcional para gerenciar as aulas de educação física das escolas do município de Mineiros.

## Funcionalidades

- Visualizar todas as aulas de educação física por escola, turno e turma.
- Adicionar novas aulas.
- Editar aulas existentes.
- Excluir aulas.
- Ver um resumo do total de aulas por professor.
- Identificar escolas com aulas sem professor atribuído.

## Como Executar o Sistema

Siga os passos abaixo para colocar o sistema no ar.

1.  **Pré-requisitos:** Certifique-se de ter o Python 3 instalado em seu computador.

2.  **Instale as dependências:** Abra o terminal na pasta raiz do projeto (`ModulacaoEF2025/`) e execute o seguinte comando:

    ```bash
    pip install -r requirements.txt
    ```

3.  **Execute o aplicativo:** Ainda no terminal, execute o arquivo principal da aplicação:

    ```bash
    python app.py
    ```

    O servidor web será iniciado.

4.  **Acesse o sistema:** Abra seu navegador e navegue até o endereço:

    ```
    [http://127.0.0.1:5000/](http://127.0.0.1:5000/)
    ```

    A interface do sistema será exibida, carregando os dados das planilhas que você forneceu. A partir daí, você poderá usar os botões "Adicionar", "Editar" e "Excluir" para gerenciar as aulas.

---

### **Estrutura do Projeto**

-   `app.py`: O arquivo principal do aplicativo Flask, que define as rotas e a lógica de negócios.
-   `database.py`: Gerencia a conexão com o banco de dados e carrega os dados iniciais.
-   `requirements.txt`: Lista as dependências do Python.
-   `templates/`: Contém os arquivos HTML da interface do usuário.
    -   `index.html`: A página principal do sistema.
-   `static/`: Contém os arquivos estáticos (CSS e JavaScript).
    -   `style.css`: Estilos visuais da página.
    -   `script.js`: Lógica do front-end para interagir com a API.
-   `modulacao.db`: O arquivo do banco de dados SQLite, que será gerado automaticamente na primeira execução.
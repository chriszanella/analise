# Visão Geral

O objetivo deste projeto é construir um backend robusto em Node.js para um painel de controle (dashboard) interativo já existente. O frontend está visualmente completo e funcional, utilizando dados de exemplo para renderizar os gráficos. A tarefa agora é criar a lógica do servidor para se conectar a um banco de dados MongoDB, processar os dados e fornecê-los ao frontend.

# Arquitetura da Aplicação

## Frontend (Concluído e Funcional)

*   **Tecnologias:** HTML5, CSS3, JavaScript (ES Modules).
*   **Componentização:** A interface é construída com Web Components, especificamente um componente `<dashboard-chart>` que encapsula a lógica dos gráficos.
*   **Visualização de Dados:** A biblioteca ApexCharts é utilizada para renderizar gráficos de barras interativos.
*   **Fonte de Dados Atual:** O frontend opera com **dados de exemplo embutidos (hardcoded)**, garantindo que a interface seja sempre funcional e visualmente correta, independentemente do estado do backend.

## Backend (A ser Construído)

*   **Tecnologia:** Node.js com o framework Express.
*   **Banco de Dados:** Irá se conectar a um banco de dados MongoDB para buscar dados brutos.
*   **API:** O objetivo é expor um endpoint (ex: `GET /api/data`) para servir os dados processados ao frontend.

# Design e Funcionalidades (Concluído)

*   **Estética Moderna:** Layout limpo, espaçamento equilibrado e um esquema de cores funcional (verde para entradas, vermelho para saídas).
*   **Responsividade:** O painel se adapta a diferentes tamanhos de tela.
*   **Navegação:** Um menu lateral e filtros de período (diário, mensal, anual) permitem uma navegação clara e intuitiva.

# Próximos Passos: Construindo o Backend do Zero

O ambiente foi preparado para que você possa focar em criar o backend. Aqui está o plano de ação recomendado:

1.  **Inicializar o Projeto Node.js:**
    *   Abra um terminal e execute `npm init -y` para criar um novo arquivo `package.json`.

2.  **Instalar Dependências:**
    *   Instale as bibliotecas necessárias para o servidor e o banco de dados: `npm install express mongodb cors`.

3.  **Criar o Servidor Básico:**
    *   Crie um novo arquivo `server.js`.
    *   Implemente um servidor Express básico que escute em uma porta (ex: 3001).
    *   Configure o `cors` para permitir requisições do seu frontend.

4.  **Implementar a Lógica de Dados:**
    *   No `server.js`, adicione o código para se conectar à sua instância do MongoDB.
    *   Crie a lógica de consulta (query) para buscar os eventos do banco de dados.
    *   Desenvolva a função para processar os dados brutos (por exemplo, aplicando a lógica "anti-fake quit").

5.  **Criar o Endpoint da API:**
    *   Crie a rota `GET /api/data`.
    *   Nessa rota, chame sua lógica de processamento e envie os dados finais como uma resposta JSON.

6.  **Reconectar o Frontend:**
    *   Quando seu backend estiver pronto e testado, modifique o `main.js` para remover os dados de exemplo e reativar a chamada `fetch` para o seu novo endpoint `/api/data`.

# Estado do Projeto

*   **Frontend:** **CONCLUÍDO**. Totalmente funcional com dados de exemplo.
*   **Backend:** **NÃO INICIADO**. O ambiente está limpo e pronto para o desenvolvimento.

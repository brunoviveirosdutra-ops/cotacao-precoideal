async function carregarDashboard() {

    try {

        const resposta = await fetch("/api/dashboard");

        const dados = await resposta.json();

        document.getElementById("totalSuppliers").textContent =
            dados.fornecedores;

        document.getElementById("totalProducts").textContent =
            dados.produtos;

        document.getElementById("totalQuotes").textContent =
            dados.cotacoes;

        document.getElementById("totalAnswers").textContent =
            dados.respostas;

    } catch (erro) {

        console.error("Erro ao carregar dashboard:", erro);

    }

}

carregarDashboard();
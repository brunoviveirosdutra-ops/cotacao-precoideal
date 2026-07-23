async function carregarDashboard() {

    try {

        const resposta = await fetch("/api/dashboard");

        const dados = await resposta.json();

        const fornecedores = document.getElementById("fornecedores");
        const produtos = document.getElementById("produtos");
        const cotacoes = document.getElementById("cotacoes");
        const respostas = document.getElementById("respostas");

        if (fornecedores) fornecedores.textContent = dados.fornecedores;
        if (produtos) produtos.textContent = dados.produtos;
        if (cotacoes) cotacoes.textContent = dados.cotacoes;
        if (respostas) respostas.textContent = dados.respostas;

    } catch (erro) {

        console.error("Erro ao carregar dashboard:", erro);

    }

}

carregarDashboard();
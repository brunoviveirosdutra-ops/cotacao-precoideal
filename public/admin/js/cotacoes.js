// ======================================================
// COTAÇÕES
// public/admin/js/cotacoes.js
// ======================================================

var quoteModal = null;

// Inicializa imediatamente quando o script é carregado
iniciarCotacoes();

async function iniciarCotacoes() {

    configurarModal();

    configurarEventos();

    await carregarCotacoes();

    console.log("✅ Módulo de Cotações carregado.");

}

// ======================================================
// MODAL
// ======================================================

function configurarModal() {

    const modal = document.getElementById("quoteModal");

    if (modal) {

        quoteModal = new bootstrap.Modal(modal);

    }

}

// ======================================================
// EVENTOS
// ======================================================

function configurarEventos() {

    const btnNova = document.getElementById("btnNovaCotacao");

    if (btnNova) {

        btnNova.addEventListener("click", () => {

            limparFormulario();

            quoteModal.show();

        });

    }

    const btnSalvar = document.getElementById("btnSalvarCotacao");

    if (btnSalvar) {

        btnSalvar.addEventListener("click", salvarCotacao);

    }

}

// ======================================================
// LISTAR COTAÇÕES
// ======================================================

async function carregarCotacoes() {

    try {

        const response = await fetch("/api/quotes");

        const quotes = await response.json();

        const tbody = document.getElementById("quotesTable");

        tbody.innerHTML = "";

        if (!quotes.length) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center">
                        Nenhuma cotação encontrada.
                    </td>
                </tr>
            `;

            return;

        }

        quotes.forEach(q => {

            tbody.innerHTML += `

                <tr>

                    <td>${q.id}</td>

                    <td>${q.title}</td>

                    <td>${formatarData(q.deadline)}</td>

                    <td>

                        <span class="badge bg-success">

                            ${q.status}

                        </span>

                    </td>

                    <td>${q.total_products}</td>

                    <td>${q.total_suppliers}</td>

                    <td>

                        <button
                            class="btn btn-sm btn-warning">

                            Editar

                        </button>

                        <button
                            class="btn btn-sm btn-danger"
                            onclick="excluirCotacao(${q.id})">

                            Excluir

                        </button>

                    </td>

                </tr>

            `;

        });

    } catch (erro) {

        console.error(erro);

    }

}

// ======================================================
// SALVAR
// ======================================================

async function salvarCotacao() {

    const dados = {

        title: document.getElementById("title").value,

        description: document.getElementById("description").value,

        deadline: document.getElementById("deadline").value

    };

    if (!dados.title || !dados.deadline) {

        alert("Preencha os campos obrigatórios.");

        return;

    }

    try {

        const response = await fetch("/api/quotes", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(dados)

        });

        const json = await response.json();

        if (!response.ok) {

            alert(json.message);

            return;

        }

        quoteModal.hide();

        limparFormulario();

        carregarCotacoes();

    } catch (erro) {

        console.error(erro);

    }

}

// ======================================================
// EXCLUIR
// ======================================================

async function excluirCotacao(id) {

    if (!confirm("Deseja excluir esta cotação?")) {

        return;

    }

    await fetch(`/api/quotes/${id}`, {

        method: "DELETE"

    });

    carregarCotacoes();

}

window.excluirCotacao = excluirCotacao;

// ======================================================
// LIMPAR
// ======================================================

function limparFormulario() {

    document.getElementById("quoteForm").reset();

}

// ======================================================
// DATA
// ======================================================

function formatarData(data) {

    if (!data) return "-";

    return new Date(data).toLocaleDateString("pt-BR");

}
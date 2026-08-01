// ======================================================
// FORNECEDORES
// public/admin/js/fornecedores.js
// ======================================================

if (!window.fornecedoresModuloCarregado) {

window.fornecedoresModuloCarregado = true;

let supplierModal = null;

// =====================================
// INICIAR
// =====================================

iniciarFornecedores();

async function iniciarFornecedores() {

    configurarModalFornecedor();

    configurarEventosFornecedor();

    await carregarFornecedores();

    console.log("✅ Módulo de fornecedores carregado.");

}

// =====================================
// MODAL
// =====================================

function configurarModalFornecedor() {

    const modal = document.getElementById("supplierModal");

    if (modal) {

        supplierModal = new bootstrap.Modal(modal);

    }

}

// =====================================
// EVENTOS
// =====================================

function configurarEventosFornecedor() {

    const btnNovo = document.getElementById("btnNovoFornecedor");

    if (btnNovo) {

        btnNovo.addEventListener("click", () => {

            limparFornecedor();

            supplierModal.show();

        });

    }

    const btnSalvar = document.getElementById("btnSalvarFornecedor");

    if (btnSalvar) {

        btnSalvar.addEventListener("click", salvarFornecedor);

    }

}

// =====================================
// LISTAR FORNECEDORES
// =====================================

async function carregarFornecedores() {

    try {

        console.log("Buscando fornecedores...");

        const response = await fetch("/api/suppliers");

        const result = await response.json();

        console.log("Resposta API:", result);

        if (!result.success) {

            alert(result.message);

            return;

        }

        const suppliers = result.suppliers || [];

        const tbody = document.getElementById("suppliersTable");

        if (!tbody) {

            console.error("Tabela suppliersTable não encontrada.");

            return;

        }

        tbody.innerHTML = "";

        if (suppliers.length === 0) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center">
                        Nenhum fornecedor cadastrado.
                    </td>
                </tr>
            `;

            return;

        }

        suppliers.forEach((supplier) => {

            const statusClass =
                supplier.status === "active"
                    ? "bg-success"
                    : "bg-danger";

            tbody.innerHTML += `
                <tr>

                    <td>${supplier.id}</td>

                    <td>${supplier.company_name}</td>

                    <td>${supplier.cnpj || "-"}</td>

                    <td>${supplier.contact_name || "-"}</td>

                    <td>${supplier.email}</td>

                    <td>

                        <span class="badge ${statusClass}">
                            ${supplier.status}
                        </span>

                    </td>

                    <td>

                        <button
                            class="btn btn-danger btn-sm"
                            onclick="excluirFornecedor(${supplier.id})">

                            Excluir

                        </button>

                    </td>

                </tr>
            `;

        });

        console.log("Tabela carregada.");

    } catch (error) {

        console.error("Erro ao listar fornecedores:", error);

    }

}
// =====================================
// SALVAR FORNECEDOR
// =====================================

async function salvarFornecedor() {

    const dados = {

        company_name: document.getElementById("companyName").value.trim(),

        cnpj: document.getElementById("cnpj").value.trim(),

        contact_name: document.getElementById("contactName").value.trim(),

        email: document.getElementById("supplierEmail").value.trim(),

        phone: document.getElementById("phone").value.trim(),

        password: document.getElementById("password").value

    };


    if (!dados.company_name || !dados.email || !dados.password) {

        alert("Preencha Empresa, E-mail e Senha.");

        return;

    }


    try {

        const response = await fetch("/api/suppliers", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(dados)

        });


        const result = await response.json();

        console.log("Cadastro fornecedor:", result);


        if (!response.ok || !result.success) {

            alert(result.message || "Erro ao cadastrar fornecedor.");

            return;

        }


        alert("Fornecedor cadastrado com sucesso!");

        supplierModal.hide();

        limparFornecedor();

        await carregarFornecedores();

    } catch (error) {

        console.error("Erro ao salvar fornecedor:", error);

        alert("Erro ao salvar fornecedor.");

    }

}
// =====================================
// EXCLUIR FORNECEDOR
// =====================================

async function excluirFornecedor(id) {

    if (!confirm("Deseja realmente excluir este fornecedor?")) {
        return;
    }

    try {

        const response = await fetch(`/api/suppliers/${id}`, {
            method: "DELETE"
        });

        const result = await response.json();

        console.log("Excluir fornecedor:", result);

        if (!response.ok || !result.success) {

            alert(result.message || "Erro ao excluir fornecedor.");

            return;

        }

        await carregarFornecedores();

    } catch (error) {

        console.error("Erro ao excluir fornecedor:", error);

        alert("Erro ao excluir fornecedor.");

    }

}

window.excluirFornecedor = excluirFornecedor;


// =====================================
// LIMPAR FORMULÁRIO
// =====================================

function limparFornecedor() {

    document.getElementById("companyName").value = "";
    document.getElementById("cnpj").value = "";
    document.getElementById("contactName").value = "";
    document.getElementById("supplierEmail").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("password").value = "";

}


// =====================================
// FECHAMENTO DO MÓDULO
// =====================================

}
// ======================================================
// COTAÇÕES
// public/admin/js/cotacoes.js
// ======================================================


let quoteModal = null;


// Iniciar módulo

iniciarCotacoes();



async function iniciarCotacoes() {


    configurarModal();


    configurarEventos();


    await carregarCotacoes();


    console.log(
        "✅ Módulo de Cotações carregado."
    );


}



// ======================================================
// MODAL
// ======================================================


function configurarModal() {


    const modal =
        document.getElementById(
            "quoteModal"
        );


    if (modal) {


        quoteModal =
            new bootstrap.Modal(modal);


    }


}



// ======================================================
// EVENTOS
// ======================================================


function configurarEventos() {


    const btnNova =
        document.getElementById(
            "btnNovaCotacao"
        );



    if (btnNova) {


        btnNova.addEventListener(
            "click",
            async () => {


                limparFormulario();


                await carregarProdutos();


                await carregarFornecedores();


                quoteModal.show();


            }

        );


    }




    const btnSalvar =
        document.getElementById(
            "btnSalvarCotacao"
        );



    if (btnSalvar) {


        btnSalvar.addEventListener(
            "click",
            salvarCotacao
        );


    }


}



// ======================================================
// LISTAR COTAÇÕES
// ======================================================


async function carregarCotacoes() {


    try {


        const response =
            await fetch(
                "/api/quotes"
            );


        const quotes =
            await response.json();



        const tbody =
            document.getElementById(
                "quotesTable"
            );



        if (!tbody)
            return;



        tbody.innerHTML = "";



        if (!quotes.length) {


            tbody.innerHTML = `

                <tr>

                    <td colspan="7"
                        class="text-center">

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


                    <td>
                        ${formatarData(q.deadline)}
                    </td>



                    <td>

                        <span class="badge bg-success">

                            ${q.status}

                        </span>


                    </td>



                    <td>

                        ${q.total_products}

                    </td>



                    <td>

                        ${q.total_suppliers}

                    </td>



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



    } catch(error) {


        console.error(error);


    }


}





// ======================================================
// CARREGAR PRODUTOS
// ======================================================


async function carregarProdutos() {


    const container =
        document.getElementById(
            "productsContainer"
        );



    try {


        const response =
            await fetch(
                "/api/products"
            );



        const products =
            await response.json();



        container.innerHTML = "";



        products.forEach(product => {



            container.innerHTML += `


                <div class="border rounded p-2 mb-2">


                    <div class="form-check">


                        <input

                            class="form-check-input product-check"

                            type="checkbox"

                            value="${product.id}"

                            id="product_${product.id}"

                        >



                        <label

                            class="form-check-label"

                            for="product_${product.id}">

                            ${product.name}

                        </label>



                    </div>




                    <input

                        type="number"

                        class="form-control mt-2 product-qty"

                        data-product="${product.id}"

                        placeholder="Quantidade"

                        min="1"

                    >



                </div>


            `;


        });



    } catch(error) {


        console.error(error);


        container.innerHTML =
            "Erro ao carregar produtos.";


    }


}





// ======================================================
// CARREGAR FORNECEDORES
// ======================================================


async function carregarFornecedores() {


    const container =
        document.getElementById(
            "suppliersContainer"
        );


    try {


        const response =
            await fetch(
                "/api/suppliers"
            );


        const data =
            await response.json();


        console.log(
            "FORNECEDORES API:",
            data
        );


        const suppliers =
            Array.isArray(data)
                ? data
                : data.suppliers;



        container.innerHTML = "";



        if (!suppliers || suppliers.length === 0) {


            container.innerHTML =
                "Nenhum fornecedor encontrado.";


            return;

        }



        suppliers.forEach(supplier => {



            container.innerHTML += `


                <div class="form-check">


                    <input

                        class="form-check-input supplier-check"

                        type="checkbox"

                        value="${supplier.id}"

                        id="supplier_${supplier.id}"

                    >



                    <label

                        class="form-check-label"

                        for="supplier_${supplier.id}">

                        ${supplier.company_name}

                    </label>



                </div>


            `;


        });



    } catch(error) {


        console.error(
            "Erro fornecedores:",
            error
        );


        container.innerHTML =
            "Erro ao carregar fornecedores.";


    }
}
// ======================================================
// SALVAR COTAÇÃO
// ======================================================


async function salvarCotacao() {


    const products = [];



    document
        .querySelectorAll(".product-check:checked")
        .forEach(item => {



            const quantity =
                document.querySelector(
                    `.product-qty[data-product="${item.value}"]`
                ).value;



            products.push({

                product_id:
                    Number(item.value),

                quantity:
                    Number(quantity || 0)

            });



        });




    const suppliers = [];


    document
        .querySelectorAll(".supplier-check:checked")
        .forEach(item => {


            suppliers.push(
                Number(item.value)
            );


        });





    const dados = {


        title:
            document.getElementById("title").value,


        description:
            document.getElementById("description").value,


        deadline:
            document.getElementById("deadline").value,


        products,


        suppliers


    };





    if (!dados.title || !dados.deadline) {


        alert(
            "Preencha título e prazo."
        );


        return;


    }





    try {



        const response =
            await fetch(
                "/api/quotes",
                {

                    method:
                        "POST",

                    headers:
                    {

                        "Content-Type":
                            "application/json"

                    },


                    body:
                        JSON.stringify(dados)

                }

            );




        const result =
            await response.json();





        if (!response.ok) {


            alert(
                result.message
            );


            return;


        }





        quoteModal.hide();


        limparFormulario();


        await carregarCotacoes();




        alert(
            "Cotação criada com sucesso!"
        );



    } catch(error) {


        console.error(error);


    }



}





// ======================================================
// EXCLUIR
// ======================================================


async function excluirCotacao(id) {


    if(
        !confirm(
            "Deseja excluir esta cotação?"
        )
    )
        return;



    await fetch(
        `/api/quotes/${id}`,
        {

            method:
                "DELETE"

        }
    );



    carregarCotacoes();



}



window.excluirCotacao =
    excluirCotacao;





// ======================================================
// LIMPAR FORMULÁRIO
// ======================================================


function limparFormulario() {


    document
        .getElementById(
            "quoteForm"
        )
        .reset();



}



// ======================================================
// DATA
// ======================================================


function formatarData(data) {


    if(!data)
        return "-";


    return new Date(data)
        .toLocaleDateString(
            "pt-BR"
        );


}
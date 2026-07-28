// ======================================================
// PRODUTOS
// public/admin/js/produtos.js
// ======================================================


let productModal = null;


// iniciar módulo

iniciarProdutos();



// ======================================================
// INICIAR
// ======================================================

async function iniciarProdutos(){


    configurarModalProduto();


    configurarEventosProduto();


    await carregarProdutos();


    console.log(
        "✅ Módulo de Produtos carregado."
    );


}



// ======================================================
// MODAL
// ======================================================


function configurarModalProduto(){


    const modal =
        document.getElementById(
            "productModal"
        );


    if(modal){

        productModal =
            new bootstrap.Modal(modal);

    }


}




// ======================================================
// EVENTOS
// ======================================================


function configurarEventosProduto(){


    const btnNovo =
        document.getElementById(
            "btnNovoProduto"
        );



    if(btnNovo){


        btnNovo.addEventListener(
            "click",
            ()=>{


                limparProduto();


                productModal.show();


            }
        );


    }





    const btnSalvar =
        document.getElementById(
            "btnSalvarProduto"
        );



    if(btnSalvar){


        btnSalvar.addEventListener(
            "click",
            salvarProduto
        );


    }


}






// ======================================================
// LISTAR PRODUTOS
// ======================================================


async function carregarProdutos(){


    try{


        const response =
            await fetch(
                "/api/products"
            );



        const products =
            await response.json();




        const tbody =
            document.getElementById(
                "productsTable"
            );



        if(!tbody)
            return;





        tbody.innerHTML = "";





        if(products.length === 0){


            tbody.innerHTML = `

                <tr>

                    <td colspan="6"
                        class="text-center">

                        Nenhum produto cadastrado.

                    </td>

                </tr>

            `;


            return;


        }






        products.forEach(product=>{



            tbody.innerHTML += `


                <tr>


                    <td>
                        ${product.id}
                    </td>



                    <td>
                        ${product.name}
                    </td>



                    <td>
                        ${product.category}
                    </td>



                    <td>
                        ${product.unit}
                    </td>




                    <td>


                        <span class="badge ${
                            product.status === "active"
                            ? "bg-success"
                            : "bg-secondary"
                        }">

                            ${product.status}

                        </span>


                    </td>





                    <td>



                        ${
                            product.status === "inactive"

                            ?

                            `

                            <button

                                class="btn btn-success btn-sm"

                                onclick="reativarProduto(${product.id})">


                                Reativar


                            </button>


                            `


                            :


                            `


                            <button

                                class="btn btn-danger btn-sm"

                                onclick="excluirProduto(${product.id})">


                                Inativar


                            </button>


                            `

                        }



                    </td>



                </tr>


            `;


        });




    }catch(error){


        console.error(error);


    }


}






// ======================================================
// SALVAR PRODUTO
// ======================================================


async function salvarProduto(){



    const dados = {



        name:

            document.getElementById(
                "productName"
            ).value,



        category:

            document.getElementById(
                "productCategory"
            ).value,



        unit:

            document.getElementById(
                "productUnit"
            ).value



    };





    if(!dados.name){


        alert(
            "Informe o nome do produto."
        );


        return;


    }






    try{


        const response =
            await fetch(

                "/api/products",

                {


                    method:
                        "POST",



                    headers:{


                        "Content-Type":
                            "application/json"


                    },



                    body:

                        JSON.stringify(dados)


                }

            );






        const result =
            await response.json();





        if(!response.ok){


            alert(
                result.message
            );


            return;


        }






        productModal.hide();



        limparProduto();



        carregarProdutos();





    }catch(error){


        console.error(error);


    }


}







// ======================================================
// INATIVAR PRODUTO
// ======================================================


async function excluirProduto(id){



    if(
        !confirm(
            "Inativar produto?"
        )
    )

        return;





    try{


        await fetch(

            `/api/products/${id}`,

            {


                method:
                    "DELETE",


                credentials:
                    "include"


            }

        );



        carregarProdutos();




    }catch(error){


        console.error(error);


    }



}




window.excluirProduto =
    excluirProduto;







// ======================================================
// REATIVAR PRODUTO
// ======================================================


async function reativarProduto(id){



    if(
        !confirm(
            "Reativar produto?"
        )
    )

        return;







    try{



        const response =
            await fetch(

                `/api/products/activate/${id}`,

                {


                    method:
                        "PUT",


                    credentials:
                        "include"


                }

            );







        const result =
            await response.json();








        if(!response.ok){


            alert(
                result.message ||
                "Erro ao reativar produto."
            );


            return;


        }





        carregarProdutos();





    }catch(error){


        console.error(error);



        alert(
            "Erro ao reativar produto."
        );


    }



}




window.reativarProduto =
    reativarProduto;








// ======================================================
// LIMPAR
// ======================================================


function limparProduto(){



    document.getElementById(
        "productName"
    ).value = "";



}
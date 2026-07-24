// ======================================================
// FORNECEDORES
// public/admin/js/fornecedores.js
// ======================================================


let supplierModal = null;


// iniciar módulo

iniciarFornecedores();



async function iniciarFornecedores(){


    configurarModalFornecedor();


    configurarEventosFornecedor();


    await carregarFornecedores();


    console.log(
        "✅ Módulo de Fornecedores carregado."
    );


}



// ======================================================
// CONFIGURAR MODAL
// ======================================================


function configurarModalFornecedor(){


    const modal =
        document.getElementById(
            "supplierModal"
        );


    if(modal){

        supplierModal =
            new bootstrap.Modal(modal);

    }


}




// ======================================================
// EVENTOS
// ======================================================


function configurarEventosFornecedor(){


    const btnNovo =
        document.getElementById(
            "btnNovoFornecedor"
        );



    if(btnNovo){


        btnNovo.addEventListener(
            "click",
            ()=>{


                limparFornecedor();


                supplierModal.show();


            }

        );


    }




    const btnSalvar =
        document.getElementById(
            "btnSalvarFornecedor"
        );



    if(btnSalvar){


        btnSalvar.addEventListener(
            "click",
            salvarFornecedor
        );


    }


}




// ======================================================
// LISTAR FORNECEDORES
// ======================================================


async function carregarFornecedores(){


    try{


        const response =
            await fetch(
                "/api/suppliers"
            );


        const suppliers =
            await response.json();



        const tbody =
            document.getElementById(
                "suppliersTable"
            );



        if(!tbody)
            return;



        tbody.innerHTML = "";



        if(suppliers.length === 0){


            tbody.innerHTML = `

                <tr>

                    <td colspan="7"
                        class="text-center">

                        Nenhum fornecedor cadastrado.

                    </td>

                </tr>

            `;


            return;

        }





        suppliers.forEach(supplier=>{


            tbody.innerHTML += `


                <tr>


                    <td>
                        ${supplier.id}
                    </td>


                    <td>
                        ${supplier.company_name}
                    </td>


                    <td>
                        ${supplier.cnpj || "-"}
                    </td>


                    <td>
                        ${supplier.contact_name || "-"}
                    </td>


                    <td>
                        ${supplier.email}
                    </td>



                    <td>


                        <span class="badge bg-success">

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



    }catch(error){


        console.error(error);


    }


}





// ======================================================
// SALVAR FORNECEDOR
// ======================================================


async function salvarFornecedor(){



    const dados = {


        company_name:
            document.getElementById(
                "companyName"
            ).value,



        cnpj:
            document.getElementById(
                "cnpj"
            ).value,



        contact_name:
            document.getElementById(
                "contactName"
            ).value,



        email:
            document.getElementById(
                "supplierEmail"
            ).value,



        phone:
            document.getElementById(
                "phone"
            ).value,



        password:
            document.getElementById(
                "password"
            ).value


    };





    if(
        !dados.company_name ||
        !dados.email ||
        !dados.password
    ){


        alert(
            "Preencha empresa, email e senha."
        );


        return;


    }






    try{


        const response =
            await fetch(
                "/api/suppliers",
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




        supplierModal.hide();


        limparFornecedor();


        carregarFornecedores();



    }catch(error){


        console.error(error);


    }


}





// ======================================================
// EXCLUIR
// ======================================================


async function excluirFornecedor(id){


    if(
        !confirm(
            "Excluir fornecedor?"
        )
    )
        return;




    await fetch(

        `/api/suppliers/${id}`,

        {

            method:
                "DELETE"

        }

    );



    carregarFornecedores();


}



window.excluirFornecedor =
    excluirFornecedor;





// ======================================================
// LIMPAR FORMULÁRIO
// ======================================================


function limparFornecedor(){


    document.getElementById(
        "companyName"
    ).value = "";


    document.getElementById(
        "cnpj"
    ).value = "";


    document.getElementById(
        "contactName"
    ).value = "";


    document.getElementById(
        "supplierEmail"
    ).value = "";


    document.getElementById(
        "phone"
    ).value = "";


    document.getElementById(
        "password"
    ).value = "";


}
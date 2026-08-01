// ======================================================
// DETALHES DA COTAÇÃO
// public/admin/js/cotacao-detalhes.js
// ======================================================


const params = new URLSearchParams(
    window.location.search
);


const id = params.get("id");



carregarCotacaoDetalhes();




// ======================================================
// CARREGAR COTAÇÃO
// ======================================================

async function carregarCotacaoDetalhes(){


    try{


        const response = await fetch(
            `/api/quotes/${id}`,
            {
                credentials:"include"
            }
        );


        const cotacao = await response.json();



        console.log("COTAÇÃO:", cotacao);

        console.log(
            "FORNECEDORES:",
            cotacao.suppliers
        );

        console.log(
            "PRODUTOS:",
            cotacao.products
        );



        mostrarCabecalho(cotacao);

mostrarProdutos(
    cotacao.products || [],
    cotacao.suppliers || []
);

      mostrarFornecedores(
    cotacao.suppliers || []
);


mostrarRespostas(
    cotacao.answers || []
);

// ======================================================
// BOTÃO EXPORTAR EXCEL
// ======================================================

const btnExcel =
document.getElementById(
    "btnExportarExcel"
);

if(btnExcel){

    btnExcel.href =
    `/api/quotes/${id}/export`;

}


    }
    catch(error){


        console.error(
            "Erro carregando detalhes:",
            error
        );


    }


}





// ======================================================
// CABEÇALHO
// ======================================================

function mostrarCabecalho(cotacao){


    const div =
    document.getElementById(
        "dadosCotacao"
    );



    if(!div)
    return;



    div.innerHTML = `


        <h3>
            ${cotacao.title}
        </h3>


        <p>
            <strong>Status:</strong>
${
    cotacao.status === "open"
        ? "🟢 Aberta"
        : "🔒 Encerrada"
}
        </p>


        <p>
            <strong>Prazo:</strong>
            ${formatarData(cotacao.deadline)}
        </p>


        <p>
            ${cotacao.description || ""}
        </p>


    `;


}







// ======================================================
// PRODUTOS
// ======================================================

function mostrarProdutos(produtos, fornecedores){


    const tabela =
    document.getElementById(
        "listaProdutos"
    );



    console.log(
        "Tabela produtos:",
        tabela
    );



    if(!tabela)
    return;



    tabela.innerHTML = "";


    const totalFornecedores = fornecedores.length;

const totalRespondidos =
    fornecedores.filter(
        fornecedor =>
            fornecedor.response_status === "respondido"
    ).length;



    if(produtos.length === 0){


        tabela.innerHTML = `

        <tr>
            <td colspan="4">
                Nenhum produto encontrado
            </td>
        </tr>

        `;


        return;

    }




    produtos.forEach(produto=>{


        console.log(
            "PRODUTO:",
            produto
        );



        tabela.innerHTML += `


        <tr>

    <td>
        ${produto.name}
    </td>

    <td>
        ${produto.quantity}
    </td>

    <td>
        ${produto.unit}
    </td>

    <td>
        ${totalRespondidos}/${totalFornecedores} responderam
    </td>

</tr>


        `;


    });



}








// ======================================================
// FORNECEDORES
// ======================================================

function mostrarFornecedores(fornecedores){


    const tabela =
    document.getElementById(
        "listaFornecedores"
    );


    if(!tabela)
    return;


    tabela.innerHTML = "";


    if(fornecedores.length === 0){


        tabela.innerHTML = `

        <tr>

            <td colspan="5">
                Nenhum fornecedor encontrado
            </td>

        </tr>

        `;


        return;

    }



    fornecedores.forEach(fornecedor=>{


        tabela.innerHTML += `

        <tr>

            <td>
                <strong>
                    ${fornecedor.company_name}
                </strong>
            </td>


            <td>
                ${fornecedor.email || "-"}
            </td>


            <td>

                ${
                    fornecedor.viewed
                    ? "👁️ Sim"
                    : "❌ Não"
                }

            </td>


            <td>

                ${
                    fornecedor.answered
                    ? "✅ Sim"
                    : "⏳ Aguardando"
                }

            </td>


            <td>

                ${
                    fornecedor.answer_date
                    ? formatarData(
                        fornecedor.answer_date
                    )
                    : "-"
                }

            </td>


        </tr>

        `;


    });


}
// ======================================================
// RESPOSTAS DOS FORNECEDORES
// ======================================================

function mostrarRespostas(respostas){


    const tabela =
    document.getElementById(
        "listaRespostas"
    );


    console.log(
        "RESPOSTAS:",
        respostas
    );


    if(!tabela)
    return;



    tabela.innerHTML = "";


    const menorPrecoPorProduto = {};

respostas.forEach(resposta => {

    const preco = Number(resposta.price);

    if (
        menorPrecoPorProduto[resposta.product_name] === undefined ||
        preco < menorPrecoPorProduto[resposta.product_name]
    ) {
        menorPrecoPorProduto[resposta.product_name] = preco;
    }

});



    if(respostas.length === 0){


        tabela.innerHTML = `

        <tr>
            <td colspan="5">
                Nenhuma resposta recebida.
            </td>
        </tr>

        `;


        return;

    }




    respostas.forEach(resposta=>{


        tabela.innerHTML += `

        <tr>

            <td>
                ${resposta.product_name}
            </td>


            <td>
                ${resposta.company_name}
            </td>


            <td>
                ${resposta.quantity}
                ${resposta.unit}
            </td>


          <td>

    ${
        Number(resposta.price) ===
        menorPrecoPorProduto[resposta.product_name]

        ? `<span class="badge bg-success">
                🏆 R$ ${Number(resposta.price)
                    .toFixed(2)
                    .replace(".", ",")}
           </span>`

        : `R$ ${Number(resposta.price)
                .toFixed(2)
                .replace(".", ",")}`
    }

</td>
            <td>
                ${resposta.observation || "-"}
            </td>


        </tr>

        `;


    });


}


// ======================================================
// FORMATAR DATA
// ======================================================

function formatarData(data){


    if(!data)
    return "-";



    return new Date(data)
    .toLocaleDateString(
        "pt-BR"
    );


}

// ======================================================
// ENCERRAR COTAÇÃO
// ======================================================

const btnEncerrar =
document.getElementById(
    "btnEncerrarCotacao"
);

if(btnEncerrar){

    btnEncerrar.addEventListener(
        "click",
        async ()=>{

            const confirmar =
            confirm(
                "Deseja realmente encerrar esta cotação?"
            );

            if(!confirmar)
            return;

            try{

                const response =
                await fetch(
                    `/api/quotes/${id}/close`,
                    {
                        method:"POST",
                        credentials:"include"
                    }
                );

                const data =
                await response.json();

                alert(data.message);

                if(data.success){

                    carregarCotacaoDetalhes();

                }
                btnEncerrar.disabled = true;
btnEncerrar.innerText = "Cotação Encerrada";
            }
            catch(error){

                console.error(error);

                alert(
                    "Erro ao encerrar cotação."
                );

            }

        }
    );

}
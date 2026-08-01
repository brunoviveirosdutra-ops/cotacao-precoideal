// ======================================================
// PAINEL FORNECEDOR
// public/fornecedor/js/painel.js
// ======================================================


document.addEventListener(
    "DOMContentLoaded",
    carregarCotacoesFornecedor
);



async function carregarCotacoesFornecedor(){


    try{


        const response =
            await fetch(
                "/api/supplier/quotes",
                {
                    credentials:"include"
                }
            );


        const data =
            await response.json();

            console.log("RESPOSTA COMPLETA:", data);
console.log(
    "QUOTES:",
    data.quotes
);

        console.log(
            "COTAÇÕES FORNECEDOR:",
            data
        );



        const container =
            document.getElementById(
                "quotesContainer"
            );


        if(!container)
            return;



        if(!data.quotes || data.quotes.length === 0){


            container.innerHTML =
                `
                <p>
                Nenhuma cotação disponível.
                </p>
                `;


            return;

        }



        container.innerHTML = "";



        data.quotes.forEach(quote => {



            container.innerHTML +=
            `

            <div class="card mb-3">


                <div class="card-body">


                    <h5>
                        ${quote.title}
                    </h5>


                    <p>
                        Prazo:
                        ${quote.deadline}
                    </p>
                    <p>
                     Status:

                    ${
                     quote.answered == 1

                     ? "🟢 Respondida"

                     : quote.viewed == 1

                    ? "🔵 Visualizada"

                    : "🟡 Pendente"
    }

</p>

                    <button
                        class="btn btn-primary"
                        onclick="abrirCotacao(${quote.id})">

                        Ver produtos

                    </button>


                </div>


            </div>


            `;



        });



    }
    catch(error){


        console.error(
            error
        );


    }


}




async function abrirCotacao(id){


    console.log(
        "Abrindo cotação:",
        id
    );


    try {


        await fetch(
            `/api/supplier/quotes/${id}/view`,
            {
                method:"PUT",
                credentials:"include"
            }
        );


    }
    catch(error){


        console.error(
            "Erro ao marcar visualização:",
            error
        );


    }



    window.location.href =
        `cotacao.html?id=${id}`;


}
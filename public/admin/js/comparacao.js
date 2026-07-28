// ======================================================
// COMPARAÇÃO DE PREÇOS
// ======================================================


async function buscarComparacao(){


    const id =
        document.getElementById(
            "quoteId"
        ).value;



    if(!id){

        alert(
            "Informe o ID da cotação."
        );

        return;

    }



    try{


        const response =
            await fetch(
                `/api/comparison/${id}`
            );



        const data =
            await response.json();




        const tabela =
            document.getElementById(
                "comparisonTable"
            );



        tabela.innerHTML = "";




        data.products.forEach(product=>{


            const menorPreco =
                Math.min(
                    ...product.suppliers.map(
                        s => s.price
                    )
                );



            product.suppliers.forEach(
                supplier=>{


                    tabela.innerHTML += `

                    <tr>


                        <td>
                            ${product.name}
                        </td>


                        <td>
                            ${product.unit}
                        </td>


                        <td>
                            ${supplier.company_name}
                        </td>


                        <td>
                            R$ ${supplier.price.toFixed(2)}
                        </td>


                        <td>

                        ${
                            supplier.price === menorPreco

                            ?

                            "🏆 Melhor preço"

                            :

                            ""

                        }

                        </td>


                    </tr>


                    `;


                }

            );



        });




    }catch(error){


        console.error(error);


        alert(
            "Erro ao carregar comparação."
        );


    }


}
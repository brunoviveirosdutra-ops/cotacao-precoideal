// ======================================================
// COTAÇÕES
// public/admin/js/cotacoes.js
// ======================================================


let quoteModal = null;


// iniciar módulo

iniciarCotacoes();



async function iniciarCotacoes(){

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


function configurarModal(){


    const modal =
        document.getElementById(
            "quoteModal"
        );


    if(modal && typeof bootstrap !== "undefined"){

        quoteModal =
            new bootstrap.Modal(modal);

    }


}







// ======================================================
// EVENTOS
// ======================================================


function configurarEventos(){



    const btnNova =
        document.getElementById(
            "btnNovaCotacao"
        );



    if(btnNova){


        btnNova.onclick = async ()=>{


            limparFormulario();


            await carregarProdutos();


            await carregarFornecedores();


            if(quoteModal){

                quoteModal.show();

            }


        };


    }





    const btnSalvar =
        document.getElementById(
            "btnSalvarCotacao"
        );



    if(btnSalvar){

        btnSalvar.onclick =
        salvarCotacao;

    }



}









// ======================================================
// LISTAR COTAÇÕES
// ======================================================


async function carregarCotacoes(){


try{


const response =
await fetch(
"/api/quotes",
{
credentials:"include"
}
);



const data =
await response.json();



const quotes =
Array.isArray(data)
? data
: data.quotes || [];




const tbody =
document.getElementById(
"quotesTable"
);



if(!tbody)
return;



tbody.innerHTML="";





if(quotes.length===0){


tbody.innerHTML=`

<tr>

<td colspan="7"
class="text-center">

Nenhuma cotação encontrada.

</td>

</tr>

`;

return;


}







quotes.forEach(q=>{


tbody.innerHTML += `


<tr>


<td>${q.id}</td>


<td>${q.title || "-"}</td>


<td>${formatarData(q.deadline)}</td>


<td>

<span class="badge bg-success">

${q.status || "-"}

</span>

</td>



<td>
${q.total_products || 0}
</td>


<td>
${q.total_suppliers || 0}
</td>



<td>


<button

class="btn btn-sm btn-primary"

onclick="verCotacao(${q.id})">

Ver

</button>




<button

class="btn btn-sm btn-warning"

onclick="editarCotacao(${q.id})">

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




}
catch(error){

console.error(
"Erro carregar cotações:",
error
);


}



}








// ======================================================
// ABRIR DETALHES
// ======================================================


function verCotacao(id){


window.location.href =
`pages/cotacao-detalhes.html?id=${id}`;

}



window.verCotacao =
verCotacao;









// ======================================================
// PRODUTOS
// ======================================================


async function carregarProdutos(){



const container =
document.getElementById(
"productsContainer"
);



if(!container)
return;



try{


const response =
await fetch(
"/api/products",
{
credentials:"include"
}
);



const data =
await response.json();



const products =
Array.isArray(data)
? data
: data.products || [];




container.innerHTML="";




products.forEach(product=>{


container.innerHTML += `


<div class="border rounded p-2 mb-2">


<div class="form-check">


<input

class="form-check-input product-check"

type="checkbox"

value="${product.id}">


<label>

${product.name}

</label>


</div>



<input

type="number"

class="form-control mt-2 product-qty"

data-product="${product.id}"

placeholder="Quantidade">


</div>


`;


});



}
catch(error){

console.error(
"Erro produtos:",
error
);

}



}









// ======================================================
// FORNECEDORES
// ======================================================


async function carregarFornecedores(){



const container =
document.getElementById(
"suppliersContainer"
);



if(!container)
return;



try{


const response =
await fetch(
"/api/suppliers",
{
credentials:"include"
}
);



const data =
await response.json();



const suppliers =
Array.isArray(data)
? data
: data.suppliers || [];




container.innerHTML="";




suppliers.forEach(supplier=>{


container.innerHTML += `


<div class="form-check">


<input

class="form-check-input supplier-check"

type="checkbox"

value="${supplier.id}">


<label>

${supplier.company_name}

</label>


</div>


`;



});



}
catch(error){

console.error(
"Erro fornecedores:",
error
);


}


}









// ======================================================
// SALVAR COTAÇÃO
// ======================================================


async function salvarCotacao(){


const products=[];



document
.querySelectorAll(".product-check:checked")
.forEach(item=>{


const qty =
document.querySelector(
`.product-qty[data-product="${item.value}"]`
)?.value || 0;



products.push({

product_id:Number(item.value),

quantity:Number(qty)

});


});





const suppliers=[];



document
.querySelectorAll(".supplier-check:checked")
.forEach(item=>{


suppliers.push(
Number(item.value)
);


});





const dados={


title:
document.getElementById("title").value,


description:
document.getElementById("description").value,


deadline:
document.getElementById("deadline").value,


products,


suppliers


};






const response =
await fetch(
"/api/quotes",
{

method:"POST",

credentials:"include",

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
result.message ||
"Erro ao criar cotação"
);


return;


}




if(quoteModal){

quoteModal.hide();

}




await carregarCotacoes();



alert(
"Cotação criada com sucesso!"
);



}









// ======================================================
// EXCLUIR
// ======================================================


async function excluirCotacao(id){


if(
!confirm(
"Deseja excluir esta cotação?"
)
)
return;



await fetch(

`/api/quotes/${id}`,

{

method:"DELETE",

credentials:"include"

}

);



await carregarCotacoes();


}



window.excluirCotacao =
excluirCotacao;









// ======================================================
// EDITAR (reservado)
// ======================================================


function editarCotacao(id){


console.log(
"Editar cotação:",
id
);


}







// ======================================================
// LIMPAR
// ======================================================


function limparFormulario(){


const form =
document.getElementById(
"quoteForm"
);



if(form){

form.reset();

}


}








// ======================================================
// DATA
// ======================================================


function formatarData(data){


if(!data)
return "-";



return new Date(data)
.toLocaleDateString(
"pt-BR"
);


}
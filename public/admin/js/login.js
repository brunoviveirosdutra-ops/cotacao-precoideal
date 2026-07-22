alert("login.js funcionando");
const form = document.getElementById("loginForm");

const message = document.getElementById("message");


form.addEventListener("submit", async (event) => {
    console.log("Botão de login acionado");

    event.preventDefault();


    const email = document.getElementById("email").value;

    const password = document.getElementById("password").value;


    try {

        const response = await fetch(
            "/api/auth/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                credentials: "include",

                body: JSON.stringify({
                    email,
                    password
                })
            }
        );


        const data = await response.json();


        console.log(data);


        if(data.success){

            message.innerHTML =
            "Login realizado com sucesso";


            setTimeout(() => {

                window.location.href =
                "/admin/admin.html";

            },1000);


        } else {

            message.innerHTML =
            data.message;

        }


    } catch(error){

        console.error(error);

        message.innerHTML =
        "Erro ao conectar com servidor";

    }

});
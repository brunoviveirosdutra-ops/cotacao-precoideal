const form = document.getElementById("loginForm");
const message = document.getElementById("message");


if (form) {

    form.addEventListener("submit", async (event) => {

        event.preventDefault();


        const email = document.getElementById("email").value.trim();

        const password = document.getElementById("password").value;


        if (!email || !password) {

            message.innerHTML = "Informe email e senha.";

            return;

        }


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


            if (data.success) {


                message.innerHTML =
                    "Login realizado com sucesso";


                setTimeout(() => {


                    window.location.href =
                        "/admin/admin.html";


                }, 1000);


            } else {


                message.innerHTML =
                    data.message || "Email ou senha inválidos";


            }


        } catch (error) {


            console.error("Erro no login:", error);


            message.innerHTML =
                "Erro ao conectar com servidor";


        }


    });

}
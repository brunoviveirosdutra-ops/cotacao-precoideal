// ======================================================
// COTAÇÃO PREÇO IDEAL
// app.js
// ======================================================

const App = {

    currentPage: "dashboard",

    async init() {

        this.renderLayout();

        await this.loadComponent(
            "#sidebar",
            "/admin/components/sidebar.html"
        );

        await this.loadComponent(
            "#header",
            "/admin/components/header.html"
        );

        this.registerMenuEvents();

        await this.loadPage("dashboard");

        this.registerLogout();

    },


    renderLayout() {

        document.getElementById("app").innerHTML = `

            <div class="layout">

                <aside
                    id="sidebar"
                    class="sidebar">
                </aside>


                <main class="content">


                    <header
                        id="header"
                        class="topbar">
                    </header>


                    <section
                        id="page-content">
                    </section>


                </main>

            </div>

        `;

    },


    async loadComponent(container, file) {

        try {

            const response = await fetch(file);


            if (!response.ok) {

                throw new Error(
                    "Componente não encontrado: " + file
                );

            }


            const html = await response.text();


            document
                .querySelector(container)
                .innerHTML = html;


        } catch (e) {


            console.error(
                "Erro carregando componente:",
                file,
                e
            );


        }

    },


    async loadPage(page) {

        this.currentPage = page;


        try {


            const response = await fetch(
                `/admin/pages/${page}.html`
            );


            if (!response.ok) {

                throw new Error(
                    "Página não encontrada."
                );

            }


            const html = await response.text();



            document
                .getElementById("page-content")
                .innerHTML = html;



            this.changeTitle(page);


            this.activateMenu(page);



            await this.loadScript(page);



        } catch (e) {


            console.error(e);



            document
                .getElementById("page-content")
                .innerHTML = `

                    <div class="alert alert-danger">

                        Erro ao carregar a página.

                    </div>

                `;


        }

    },


    // ======================================================
    // CARREGAMENTO CORRETO DOS SCRIPTS
    // ======================================================

    async loadScript(page) {


        return new Promise((resolve) => {


            const antigo =
                document.getElementById(
                    "dynamic-script"
                );


            if (antigo) {

                antigo.remove();

            }



            const script =
                document.createElement(
                    "script"
                );



            script.id =
                "dynamic-script";



            script.src =
                `/admin/js/${page}.js?v=${Date.now()}`;



            script.onload = () => {

                resolve();

            };



            script.onerror = () => {


                console.error(

                    "Erro carregando script:",
                    `/admin/js/${page}.js`

                );


                resolve();


            };



            document.body.appendChild(script);



        });


    },


    // ======================================================
    // MENU
    // ======================================================

    registerMenuEvents() {


        document.addEventListener(
            "click",
            (e) => {


                const item =
                    e.target.closest(
                        "[data-page]"
                    );



                if (!item)
                    return;



                e.preventDefault();



                this.loadPage(
                    item.dataset.page
                );


            }

        );


    },



    activateMenu(page) {


        document
            .querySelectorAll("[data-page]")
            .forEach(item => {



                item.classList.remove(
                    "active"
                );



                if (
                    item.dataset.page === page
                ) {


                    item.classList.add(
                        "active"
                    );


                }


            });


    },



    changeTitle(page) {


        const titles = {


            dashboard:
                "Dashboard",


            produtos:
                "Produtos",


            fornecedores:
                "Fornecedores",


            cotacoes:
                "Cotações",


            relatorios:
                "Relatórios",


            configuracoes:
                "Configurações"


        };



        const titulo =
            document.getElementById(
                "tituloPagina"
            );



        if (titulo) {


            titulo.textContent =
                titles[page] || page;


        }


    },



    // ======================================================
    // LOGOUT
    // ======================================================

    registerLogout() {


        document.addEventListener(
            "click",
            async (e) => {



                if (
                    e.target.id !== "btnLogout"
                )
                    return;



                try {


                    await fetch(

                        "/api/auth/logout",

                        {

                            method: "POST"

                        }

                    );


                } catch (e) {}



                location.href =
                    "/admin/login.html";



            }

        );


    }


};



window.addEventListener(

    "DOMContentLoaded",

    () => App.init()

);
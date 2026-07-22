document.getElementById("app").innerHTML = `
<div class="layout">

    <aside class="sidebar">
        ...
    </aside>

    <main class="content">

        <header class="topbar">

            <h2 id="tituloPagina">Dashboard</h2>

            <div class="user">

                <i class="fa-solid fa-user-circle"></i>

                <span id="adminName">Carregando...</span>

                <button id="btnLogout" class="btn btn-danger btn-sm">
                    Sair
                </button>

            </div>

        </header>

        <section id="page-content"></section>

    </main>

</div>
`;
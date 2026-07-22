document.addEventListener("DOMContentLoaded", async () => {

    const app = document.getElementById("app");

    app.innerHTML = `
        <div class="container-fluid">

            <div class="row">

                <aside class="col-2 bg-dark text-white min-vh-100 p-3">

                    <h4 class="mb-4">
                        Cotação
                    </h4>

                    <ul class="nav flex-column">

                        <li class="nav-item">
                            <a class="nav-link text-white" href="#">
                                <i class="bi bi-speedometer2"></i>
                                Dashboard
                            </a>
                        </li>

                        <li class="nav-item">
                            <a class="nav-link text-white" href="#">
                                <i class="bi bi-buildings"></i>
                                Fornecedores
                            </a>
                        </li>

                        <li class="nav-item">
                            <a class="nav-link text-white" href="#">
                                <i class="bi bi-box-seam"></i>
                                Produtos
                            </a>
                        </li>

                        <li class="nav-item">
                            <a class="nav-link text-white" href="#">
                                <i class="bi bi-file-earmark-text"></i>
                                Cotações
                            </a>
                        </li>

                    </ul>

                </aside>

                <main class="col-10">

                    <div class="p-4">

                        <h2>
                            Dashboard
                        </h2>

                        <hr>

                        <div class="row g-4">

                            <div class="col-md-3">
                                <div class="card shadow-sm">
                                    <div class="card-body">
                                        <h5>Fornecedores</h5>
                                        <h2>0</h2>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-3">
                                <div class="card shadow-sm">
                                    <div class="card-body">
                                        <h5>Produtos</h5>
                                        <h2>0</h2>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-3">
                                <div class="card shadow-sm">
                                    <div class="card-body">
                                        <h5>Cotações</h5>
                                        <h2>0</h2>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-3">
                                <div class="card shadow-sm">
                                    <div class="card-body">
                                        <h5>Respostas</h5>
                                        <h2>0</h2>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>

                </main>

            </div>

        </div>
    `;

});
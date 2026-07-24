/* ===========================
   APP
=========================== */

document
    .getElementById("search")
    .addEventListener("input", e =>
        setSearch(e.target.value)
    );

document
    .getElementById("heroSearch")
    .addEventListener("input", e =>
        setSearch(e.target.value)
    );

document
    .getElementById("heroSearchForm")
    .addEventListener("submit", e => {

        e.preventDefault();

        setSearch(
            document.getElementById("heroSearch").value
        );

        document
            .getElementById("directorio")
            .scrollIntoView({
                behavior: "smooth"
            });

    });

cargarComercios();
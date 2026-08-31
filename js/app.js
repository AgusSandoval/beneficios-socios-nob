/* ===========================
   APP
=========================== */

DOM.search.addEventListener("input", e => {

    setSearch(e.target.value);

});

DOM.heroSearch.addEventListener("input", e => {

    setSearch(e.target.value);

});

DOM.heroSearchForm.addEventListener("submit", e => {

    e.preventDefault();

    setSearch(
        DOM.heroSearch.value
    );

    DOM.directorio.scrollIntoView({
        behavior: "smooth"
    });

});

cargarComercios();
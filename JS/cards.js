/* ===========================
   CARDS
=========================== */

function render() {

    const term = APP.filtros.busqueda.toLowerCase();

    const filtered = APP.items.filter(it => {

        const matchesRubro =
            APP.filtros.rubro === "Todos" ||
            it.rubro === APP.filtros.rubro;

        const haystack = `
            ${it.nombreComercio || ""}
            ${it.personaContacto || ""}
            ${it.descripcion || ""}
            ${it.rubro || ""}
            ${it.filial || ""}
            ${it.ciudad || ""}
        `.toLowerCase();

        return matchesRubro &&
            (!term || haystack.includes(term));

    });

    DOM.countLine.textContent =
        `${filtered.length} comercio${filtered.length === 1 ? "" : "s"} de socios encontrados`;

    if (filtered.length === 0) {

        if (APP.items.length === 0) {

            DOM.countLine.textContent =
                "Todavía no hay comercios adheridos";

            DOM.grid.innerHTML = `
<div class="empty" style="grid-column:1/-1;text-align:center;padding:50px 20px;">
    <h2>¡Próximamente!</h2>

    <p style="margin:15px 0;">
        Todavía no hay comercios adheridos.
    </p>

    <p style="margin-bottom:25px;">
        ¿Tenés un emprendimiento?<br>
        ¡Sé el primero en sumarte!
    </p>

    <a class="btn" href="${CONFIG.formUrl}">
        Adherir mi comercio
    </a>
</div>`;

            return;

        }

        DOM.grid.innerHTML = `
<div class="empty" style="grid-column:1/-1;">
No hay comercios que coincidan con la búsqueda.
</div>`;

        return;

    }

    DOM.grid.innerHTML = filtered.map(it => {

        const wa = waLink(it.whatsapp);
        const ig = instagramLink(it.instagram);
        const fb = facebookLink(it.facebook);

        const slug = slugify(it.nombreComercio);

        const initials =
            (it.nombreComercio || "?")
                .trim()
                .slice(0, 2)
                .toUpperCase();

        const logo = it.logo
            ? `<img class="logo-img" src="${it.logo}" alt="" loading="lazy">`
            : `<div class="monogram">${escapeHtml(initials)}</div>`;

        return `

<div class="card">

${it.beneficio ? `
<div class="discount-badge">
${escapeHtml(it.beneficio)}
</div>` : ""}

<div class="top-row">

<div class="id-row">

${logo}

<div>

<div class="rubro">
${escapeHtml(it.rubro || "General")}
</div>

<h3>
${escapeHtml(it.nombreComercio)}
</h3>

<div class="persona">
${escapeHtml(it.personaContacto || "")}
</div>

</div>

</div>

</div>

${it.descripcion ? `
<p class="desc">
${escapeHtml(it.descripcion)}
</p>` : ""}

<div class="meta">

${it.ciudad ? `
<span class="zona">${escapeHtml(it.ciudad)}</span>` : ""}

${it.filial ? `
<span class="filial">${escapeHtml(it.filial)}</span>` : ""}

</div>

<div class="actions">

<button
class="btn btn-detail"
data-slug="${escapeHtml(slug)}">
Ver beneficio
</button>

${wa ? `
<a class="btn secondary"
href="${wa}"
target="_blank">
WhatsApp
</a>` : ""}

${ig ? `
<a class="btn secondary"
href="${ig}"
target="_blank">
Instagram
</a>` : ""}

${fb ? `
<a class="btn secondary"
href="${fb}"
target="_blank">
Facebook
</a>` : ""}

</div>

</div>`;

    }).join("");

}

function buildChips() {

    const rubros = [
        "Todos",
        ...new Set(
            APP.items
                .map(i => i.rubro)
                .filter(Boolean)
        )
    ];

    DOM.chips.innerHTML = rubros.map(r => `
<button
class="chip ${r === APP.filtros.rubro ? "active" : ""}"
data-rubro="${escapeHtml(r)}">
${escapeHtml(r)}
</button>
`).join("");

    DOM.chips
        .querySelectorAll(".chip")
        .forEach(btn => {

            btn.addEventListener("click", () => {

                APP.filtros.rubro = btn.dataset.rubro;

                DOM.chips
                    .querySelectorAll(".chip")
                    .forEach(c => c.classList.remove("active"));

                btn.classList.add("active");

                render();

            });

        });

}

function updateStats() {

    const comercios = APP.items.length;

    const rubros = new Set(
        APP.items
            .map(i => i.rubro)
            .filter(Boolean)
    ).size;

    const localidades = new Set(
        APP.items
            .map(i => i.ciudad)
            .filter(Boolean)
    ).size;

    DOM.statComercios.textContent =
        comercios || "—";

    DOM.statRubros.textContent =
        rubros || "—";

    DOM.statLocalidades.textContent =
        localidades || "—";

}

function setSearch(value) {

    APP.filtros.busqueda = value;

    if (DOM.heroSearch.value !== value)
        DOM.heroSearch.value = value;

    if (DOM.search.value !== value)
        DOM.search.value = value;

    render();

}

/* ===========================
   INIT
=========================== */

function init() {

    buildChips();

    render();

    updateStats();

    initMap();

    openDetailFromUrl();

}
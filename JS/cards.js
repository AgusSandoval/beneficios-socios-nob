function render() {
    const grid = document.getElementById("grid");
    const countLine = document.getElementById("countLine");
    const term = searchTerm.toLowerCase();

    const filtered = ALL_ITEMS.filter(it => {
        const matchesRubro =
            activeRubro === "Todos" || it.rubro === activeRubro;

        const haystack = `
            ${it.nombreComercio || ""}
            ${it.personaContacto || ""}
            ${it.descripcion || ""}
            ${it.rubro || ""}
            ${it.filial || ""}
            ${it.ciudad || ""}
        `.toLowerCase();

        const matchesSearch =
            !term || haystack.includes(term);

        return matchesRubro && matchesSearch;
    });

    countLine.textContent =
        `${filtered.length} comercio${filtered.length === 1 ? "" : "s"} de socios encontrados`;

    if (filtered.length === 0) {

        if (ALL_ITEMS.length === 0) {

            countLine.textContent =
                "Todavía no hay comercios adheridos";

            grid.innerHTML = `
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

</div>
`;

            return;
        }

        grid.innerHTML = `
<div class="empty" style="grid-column:1/-1;">
No hay comercios que coincidan con la búsqueda.
</div>
`;

        return;
    }

    grid.innerHTML = filtered.map(it => {

        const wa = waLink(it.whatsapp);
        const ig = instagramLink(it.instagram);
        const fb = facebookLink(it.facebook);

        const slug = slugify(it.nombreComercio);

        const initials =
            (it.nombreComercio || "?")
                .trim()
                .slice(0, 2)
                .toUpperCase();

        const idBlock = it.logo
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

${idBlock}

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
<span class="zona">${escapeHtml(it.ciudad)}</span>
` : ""}

${it.filial ? `
<span class="filial">${escapeHtml(it.filial)}</span>
` : ""}

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

</div>

`;

    }).join("");
}

function buildChips() {

    const rubros = [
        "Todos",
        ...new Set(
            ALL_ITEMS
                .map(i => i.rubro)
                .filter(Boolean)
        )
    ];

    const chips =
        document.getElementById("chips");

    chips.innerHTML =
        rubros.map(r => `
<button
class="chip ${r === activeRubro ? "active" : ""}"
data-rubro="${escapeHtml(r)}">
${escapeHtml(r)}
</button>
`).join("");

    chips.querySelectorAll(".chip")
        .forEach(btn => {

            btn.addEventListener("click", () => {

                activeRubro = btn.dataset.rubro;

                chips.querySelectorAll(".chip")
                    .forEach(c => c.classList.remove("active"));

                btn.classList.add("active");

                render();

            });

        });

}

function updateStats() {

    const comercios =
        ALL_ITEMS.length;

    const rubros =
        new Set(
            ALL_ITEMS.map(i => i.rubro).filter(Boolean)
        ).size;

    const localidades =
        new Set(
            ALL_ITEMS.map(i => i.ciudad).filter(Boolean)
        ).size;

    const set = (id, value) => {

        const el = document.getElementById(id);

        if (el) {

            el.textContent =
                value === 0 ? "—" : value;

        }

    }

    set("statComercios", comercios);
    set("statRubros", rubros);
    set("statLocalidades", localidades);

}

function setSearch(value) {

    searchTerm = value;

    const hero =
        document.getElementById("heroSearch");

    const dir =
        document.getElementById("search");

    if (hero && hero.value !== value)
        hero.value = value;

    if (dir && dir.value !== value)
        dir.value = value;

    render();

}

function init(items) {

    ALL_ITEMS = items;

    buildChips();

    render();

    updateStats();

    initMap();

    openDetailFromUrl();

}
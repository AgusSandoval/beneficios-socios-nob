/* ===========================
   DETALLE DEL COMERCIO
=========================== */

document.getElementById("grid").addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-detail");
    if (!btn) return;

    const item = ALL_ITEMS.find(
        it => slugify(it.nombreComercio) === btn.dataset.slug
    );

    if (item) {
        openDetail(item);
    }
});

function openDetail(item) {
    const slug = slugify(item.nombreComercio);

    history.pushState(
        { slug },
        "",
        `?comercio=${slug}`
    );

    showDetail(item);
}

function closeDetail() {

    history.pushState(
        {},
        "",
        window.location.pathname
    );

    const el = document.getElementById("detailView");

    el.hidden = true;
    el.innerHTML = "";

    document.body.style.overflow = "";

}

function showDetail(item) {

    const wa = waLink(item.whatsapp);
    const ig = instagramLink(item.instagram);
    const fb = facebookLink(item.facebook);

    const mapsQuery =
        item.direccion ||
        `${item.nombreComercio} ${item.ciudad || ""}`;

    const mapsUrl =
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`;

    const initials =
        (item.nombreComercio || "?")
            .slice(0, 2)
            .toUpperCase();

    const idBlock = item.logo
        ? `<img class="logo-img detail-logo" src="${item.logo}" alt="">`
        : `<div class="monogram detail-logo">${escapeHtml(initials)}</div>`;

    const el =
        document.getElementById("detailView");

    el.innerHTML = `

<div class="detail-inner">

<button
class="detail-close"
type="button">
← Volver al directorio
</button>

<div class="detail-head">

${idBlock}

<div>

<div class="rubro">
${escapeHtml(item.rubro || "General")}
</div>

<h2>
${escapeHtml(item.nombreComercio)}
</h2>

<div class="persona">
${escapeHtml(item.personaContacto || "")}
</div>

</div>

</div>

${item.beneficio ? `
<div class="detail-descuento">

${escapeHtml(item.beneficio)}

<span>
Beneficio para socios
</span>

</div>
` : ""}

${item.descripcion ? `
<p class="detail-desc">
${escapeHtml(item.descripcion)}
</p>
` : ""}

<div class="detail-meta">

${item.ciudad ? `
<div>
<b>Ciudad</b>
<span>${escapeHtml(item.ciudad)}</span>
</div>
` : ""}

${item.filial ? `
<div>
<b>Peña / Filial</b>
<span>${escapeHtml(item.filial)}</span>
</div>
` : ""}

</div>

<div class="detail-actions">

${wa ? `
<a
class="btn-primary"
href="${wa}"
target="_blank"
rel="noopener">
WhatsApp
</a>
` : ""}

<a
class="btn-ghost detail-ghost"
href="${mapsUrl}"
target="_blank"
rel="noopener">
Cómo llegar
</a>

${ig ? `
<a
class="btn-ghost detail-ghost"
href="${ig}"
target="_blank"
rel="noopener">
Instagram
</a>
` : ""}

${fb ? `
<a
class="btn-ghost detail-ghost"
href="${fb}"
target="_blank"
rel="noopener">
Facebook
</a>
` : ""}

</div>

</div>
`;

    el.hidden = false;

    document.body.style.overflow = "hidden";

    el.querySelector(".detail-close")
        .addEventListener("click", closeDetail);

    window.scrollTo({
        top: 0
    });

}

function openDetailFromUrl() {

    const slug =
        new URLSearchParams(window.location.search)
            .get("comercio");

    if (!slug) return;

    const item =
        ALL_ITEMS.find(
            it => slugify(it.nombreComercio) === slug
        );

    if (item) {
        showDetail(item);
    }

}

window.addEventListener("popstate", () => {

    const slug =
        new URLSearchParams(window.location.search)
            .get("comercio");

    const item =
        slug
            ? ALL_ITEMS.find(
                it => slugify(it.nombreComercio) === slug
            )
            : null;

    if (item) {

        showDetail(item);

    } else {

        document.getElementById("detailView").hidden = true;
        document.body.style.overflow = "";

    }

});
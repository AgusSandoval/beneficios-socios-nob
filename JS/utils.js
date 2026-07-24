function normalizeRow(row) {
    const item = {};

    Object.keys(row).forEach(k => {
        const key = COLS[k.trim()];
        if (!key) return;

        const val = row[k];

        if (Array.isArray(val) && val.length && val[0] && val[0].url) {
            item[key] =
                (val[0].thumbnails &&
                    val[0].thumbnails.large &&
                    val[0].thumbnails.large.url) ||
                val[0].url;
        } else {
            item[key] = (val || "").toString().trim();
        }
    });

    return item;
}

function waLink(numero) {
    const clean = (numero || "").replace(/[^0-9]/g, "");
    return clean ? `https://wa.me/${clean}` : null;
}

function toUrl(value, baseDomain) {
    if (!value) return null;

    const clean = value.trim().replace(/^@/, "");

    if (clean.startsWith("http")) return clean;
    if (clean.includes(".")) return `https://${clean}`;

    return `https://${baseDomain}/${clean}`;
}

function instagramLink(value) {
    return toUrl(value, "instagram.com");
}

function facebookLink(value) {
    return toUrl(value, "facebook.com");
}

function slugify(str) {
    return (str || "socio")
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") || "socio";
}

function escapeHtml(str) {
    return (str || "").replace(/[&<>"']/g, c => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[c]));
}
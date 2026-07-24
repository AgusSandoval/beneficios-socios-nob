/* ===========================
   FORMULARIOS Y FOOTER
=========================== */

function setupFormLinks() {

    const el = document.getElementById("formAltLink");

    if (!el) return;

    if (CONFIG.formUrl) {
        el.href = CONFIG.formUrl;
    } else {
        el.closest("p").hidden = true;
    }

}

setupFormLinks();

function setupPenaSocial() {

    const wa = document.getElementById("footWa");
    const ig = document.getElementById("footIg");
    const fb = document.getElementById("footFb");

    const waUrl = CONFIG.penaWhatsapp
        ? `https://wa.me/${CONFIG.penaWhatsapp.replace(/[^0-9]/g, "")}`
        : null;

    const igUrl = instagramLink(CONFIG.penaInstagram);
    const fbUrl = facebookLink(CONFIG.penaFacebook);

    [
        [wa, waUrl],
        [ig, igUrl],
        [fb, fbUrl]
    ].forEach(([el, url]) => {

        if (!el) return;

        if (url) {
            el.href = url;
        } else {
            el.style.display = "none";
        }

    });

}

setupPenaSocial();

function setupQR() {

    const img = document.getElementById("qrImg");

    if (!img) return;

    const url =
        window.location.origin +
        window.location.pathname;

    img.src =
        `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(url)}`;

}

setupQR();

/* ===========================
   FORMULARIO ADHERITE
=========================== */

document
    .getElementById("formAdherite")
    .addEventListener("submit", async (e) => {

        e.preventDefault();

        const form = e.target;

        const btn =
            document.getElementById("formSubmitBtn");

        const msg =
            document.getElementById("formMsg");

        const data =
            Object.fromEntries(
                new FormData(form).entries()
            );

        btn.disabled = true;
        btn.textContent = "Enviando...";

        msg.hidden = true;

        try {

            const res =
                await fetch(
                    "/.netlify/functions/submit-comercio",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(data)
                    }
                );

            const out =
                await res.json().catch(() => ({}));

            if (!res.ok || !out.ok) {
                throw new Error(
                    out.error || `HTTP ${res.status}`
                );
            }

            msg.hidden = false;
            msg.className = "form-msg ok";
            msg.textContent =
                "¡Listo! Tu comercio quedó cargado y en revisión.";

            form.reset();

        } catch (err) {

            msg.hidden = false;
            msg.className = "form-msg error";
            msg.textContent = err.message;

            console.error(err);

        } finally {

            btn.disabled = false;
            btn.textContent = "Enviar mi beneficio";

        }

    });
/* ===========================
   FOOTER
=========================== */

function setupFormLinks() {

    if (!DOM.formAltLink) return;

    if (CONFIG.formUrl) {

        DOM.formAltLink.href = CONFIG.formUrl;

    } else {

        DOM.formAltLink.closest("p").hidden = true;

    }

}

function setupPenaSocial() {

    const links = [

        [DOM.footWa, waLink(CONFIG.penaWhatsapp)],
        [DOM.footIg, instagramLink(CONFIG.penaInstagram)],
        [DOM.footFb, facebookLink(CONFIG.penaFacebook)]

    ];

    links.forEach(([elemento, url]) => {

        if (!elemento) return;

        if (url) {

            elemento.href = url;

        } else {

            elemento.style.display = "none";

        }

    });

}

function setupQR() {

    if (!DOM.qr) return;

    const url =
        window.location.origin +
        window.location.pathname;

    DOM.qr.src =
        `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(url)}`;

}

/* ===========================
   FORMULARIO
=========================== */

async function submitForm(event) {

    event.preventDefault();

    const form = event.target;

    const data = Object.fromEntries(
        new FormData(form).entries()
    );

    DOM.formBtn.disabled = true;
    DOM.formBtn.textContent = "Enviando...";

    DOM.formMsg.hidden = true;

    try {

        const response = await fetch(
            "/.netlify/functions/submit-comercio",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }
        );

        const result =
            await response.json().catch(() => ({}));

        if (!response.ok || !result.ok) {

            throw new Error(
                result.error || `HTTP ${response.status}`
            );

        }

        DOM.formMsg.hidden = false;
        DOM.formMsg.className = "form-msg ok";
        DOM.formMsg.textContent =
            "¡Listo! Tu comercio quedó cargado y en revisión.";

        form.reset();

    } catch (error) {

        console.error(error);

        DOM.formMsg.hidden = false;
        DOM.formMsg.className = "form-msg error";
        DOM.formMsg.textContent = error.message;

    } finally {

        DOM.formBtn.disabled = false;
        DOM.formBtn.textContent = "Enviar mi beneficio";

    }

}

/* ===========================
   INIT
=========================== */

setupFormLinks();

setupPenaSocial();

setupQR();

if (DOM.form) {

    DOM.form.addEventListener(
        "submit",
        submitForm
    );

}
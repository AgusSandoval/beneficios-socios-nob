/* ===========================
   MAPA
=========================== */

let mapInstance = null;

function initMap() {

    if (!DOM.map || typeof L === "undefined") {
        return;
    }

    const points = APP.items
        .map(item => ({
            item,
            lat: Number(item.lat),
            lng: Number(item.lng)
        }))
        .filter(point =>
            Number.isFinite(point.lat) &&
            Number.isFinite(point.lng)
        );

    if (points.length === 0) {

        DOM.mapEmpty.hidden = false;

        if (mapInstance) {
            mapInstance.remove();
            mapInstance = null;
        }

        return;

    }

    DOM.mapEmpty.hidden = true;

    if (mapInstance) {
        mapInstance.remove();
        mapInstance = null;
    }

    DOM.map.innerHTML = "";

    mapInstance = L.map(DOM.map).setView(
        [-34.6037, -58.3816],
        11
    );

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 18,
            attribution: "&copy; colaboradores de OpenStreetMap"
        }
    ).addTo(mapInstance);

    const bounds = [];

    points.forEach(({ item, lat, lng }) => {

        bounds.push([lat, lng]);

        L.marker([lat, lng])
            .addTo(mapInstance)
            .bindPopup(`
                <strong>${escapeHtml(item.nombreComercio)}</strong><br>
                ${escapeHtml(item.beneficio || "")}
            `);

    });

    if (bounds.length === 1) {

        mapInstance.setView(bounds[0], 15);

    } else {

        mapInstance.fitBounds(bounds, {
            padding: [30, 30]
        });

    }

}
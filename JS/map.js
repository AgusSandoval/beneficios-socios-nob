/* ===========================
   MAPA
=========================== */

function initMap() {

    const mapEl = document.getElementById("map");
    const emptyEl = document.getElementById("mapEmpty");

    if (!mapEl || typeof L === "undefined") {
        return;
    }

    const points = ALL_ITEMS
        .map(item => ({
            item,
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lng)
        }))
        .filter(point =>
            Number.isFinite(point.lat) &&
            Number.isFinite(point.lng)
        );

    if (points.length === 0) {
        emptyEl.hidden = false;
        return;
    }

    emptyEl.hidden = true;

    const map = L.map("map").setView(
        [-34.6037, -58.3816],
        11
    );

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 18,
            attribution: "&copy; colaboradores de OpenStreetMap"
        }
    ).addTo(map);

    const bounds = [];

    points.forEach(({ item, lat, lng }) => {

        bounds.push([lat, lng]);

        L.marker([lat, lng])
            .addTo(map)
            .bindPopup(`
                <strong>${escapeHtml(item.nombreComercio)}</strong><br>
                ${escapeHtml(item.beneficio || "")}
            `);

    });

    if (bounds.length > 1) {
        map.fitBounds(bounds, {
            padding: [30, 30]
        });
    }

}
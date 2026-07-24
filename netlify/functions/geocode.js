// netlify/functions/geocode.js

exports.handler = async (event) => {

    const cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, OPTIONS"
    };

    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 204,
            headers: cors,
            body: ""
        };
    }

    if (event.httpMethod !== "GET") {
        return {
            statusCode: 405,
            headers: cors,
            body: JSON.stringify({
                ok: false,
                error: "Método no permitido"
            })
        };
    }

    const direccion = event.queryStringParameters?.direccion?.trim();

    if (!direccion) {
        return {
            statusCode: 400,
            headers: cors,
            body: JSON.stringify({
                ok: false,
                error: "Falta la dirección"
            })
        };
    }

    try {

        const url =
            `https://nominatim.openstreetmap.org/search?` +
            `format=json&limit=1&q=${encodeURIComponent(direccion)}`;

        const response = await fetch(url, {
            headers: {
                "User-Agent": "BeneficiosSociosNewells/1.0"
            }
        });

        if (!response.ok) {
            throw new Error("Error consultando Nominatim");
        }

        const data = await response.json();

        if (!data.length) {
            return {
                statusCode: 404,
                headers: cors,
                body: JSON.stringify({
                    ok: false,
                    error: "Dirección no encontrada"
                })
            };
        }

        return {
            statusCode: 200,
            headers: cors,
            body: JSON.stringify({
                ok: true,
                lat: Number(data[0].lat),
                lng: Number(data[0].lon)
            })
        };

    } catch (err) {

        return {
            statusCode: 500,
            headers: cors,
            body: JSON.stringify({
                ok: false,
                error: err.message
            })
        };

    }

};
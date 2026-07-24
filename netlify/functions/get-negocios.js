// netlify/functions/get-negocios.js

exports.handler = async (event) => {
    const cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
    };

    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 204,
            headers: cors,
            body: "",
        };
    }

    if (event.httpMethod !== "GET") {
        return {
            statusCode: 405,
            headers: cors,
            body: JSON.stringify({
                ok: false,
                error: "Método no permitido",
            }),
        };
    }

    const AIRTABLE_TOKEN = process.env.AIRTABLE_WRITE_TOKEN;
    const BASE_ID = process.env.AIRTABLE_BASE_ID || "app4jSY7c4UJ14ILU";
    const TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || "Comercios";

    if (!AIRTABLE_TOKEN) {
        return {
            statusCode: 500,
            headers: cors,
            body: JSON.stringify({
                ok: false,
                error: "Falta AIRTABLE_WRITE_TOKEN",
            }),
        };
    }

    try {
        let records = [];
        let offset = null;

        do {
            let url =
                `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_NAME)}` +
                `?pageSize=100&filterByFormula=${encodeURIComponent("{Estado}='Aprobado'")}`;

            if (offset) {
                url += `&offset=${offset}`;
            }

            console.log("BASE_ID:", BASE_ID);
            console.log("TABLE_NAME:", TABLE_NAME);
            console.log("URL:", url);

            const res = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${AIRTABLE_TOKEN}`,
                },
            });

            console.log("STATUS:", res.status);

            const data = await res.json();

            console.log("AIRTABLE RESPONSE:");
            console.log(JSON.stringify(data, null, 2));

            if (!res.ok) {
                const msg = data?.error?.message || "Error consultando Airtable";
                throw new Error(msg);
            }

            records = records.concat(data.records || []);
            offset = data.offset || null;

        } while (offset);

        return {
            statusCode: 200,
            headers: cors,
            body: JSON.stringify(records),
        };

    } catch (err) {
        console.error(err);

        return {
            statusCode: 500,
            headers: cors,
            body: JSON.stringify({
                ok: false,
                error: err.message,
            }),
        };
    }
};
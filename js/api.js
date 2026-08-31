/* ===========================
   API
=========================== */

async function fetchAirtableAll() {

    const response = await fetch(
        "/.netlify/functions/get-negocios"
    );

    if (!response.ok) {

        throw new Error(
            "No se pudieron obtener los comercios"
        );

    }

    return response.json();

}

async function cargarComercios() {

    try {

        const records = await fetchAirtableAll();

        APP.items = records
            .map(record => normalizeRow(record.fields))
            .filter(item => item.nombreComercio);

        init();

    } catch (error) {

        console.error(error);

        APP.items = [];

        init();

    }

}
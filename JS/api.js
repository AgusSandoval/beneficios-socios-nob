/* ===========================
   API
=========================== */

async function fetchAirtableAll() {

    const res = await fetch(
        "/.netlify/functions/get-negocios"
    );

    if (!res.ok) {
        throw new Error(
            "No se pudieron obtener los comercios"
        );
    }

    return await res.json();

}

function cargarComercios() {

    fetchAirtableAll()

        .then(records => {

            const items = records
                .map(r => normalizeRow(r.fields))
                .filter(it => it.nombreComercio);

            init(items);

        })

        .catch(err => {

            console.error(err);

            init([]);

        });

}
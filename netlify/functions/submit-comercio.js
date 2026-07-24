exports.handler = async (event) => {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: cors, body: "" };
  }

  if (event.httpMethod !== "POST") {
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
        error: "Falta configurar AIRTABLE_WRITE_TOKEN en Netlify.",
      }),
    };
  }

  let data;

  try {
    data = JSON.parse(event.body || "{}");
  } catch {
    return {
      statusCode: 400,
      headers: cors,
      body: JSON.stringify({
        ok: false,
        error: "JSON inválido.",
      }),
    };
  }

  const clean = (v) =>
    typeof v === "string" ? v.trim().slice(0, 500) : "";

  const personaContacto = clean(data.personaContacto);
  const nombreComercio = clean(data.nombreComercio);
  const filial = clean(data.filial);
  const rubro = clean(data.rubro);
  const descripcion = clean(data.descripcion);

  const beneficio = clean(data.beneficio);
  const ciudad = clean(data.ciudad);
  const direccion = clean(data.direccion);

  const whatsapp = clean(data.whatsapp);
  const instagram = clean(data.instagram);
  const facebook = clean(data.facebook);

  const sitioWeb = clean(data.sitioWeb);
  const email = clean(data.email);

  const errores = [];

  if (!personaContacto) errores.push("Persona de contacto");
  if (!nombreComercio) errores.push("Nombre del comercio");
  if (!rubro) errores.push("Rubro");
  if (!beneficio) errores.push("Beneficio");
  if (!ciudad) errores.push("Ciudad");

  if (errores.length) {
    return {
      statusCode: 400,
      headers: cors,
      body: JSON.stringify({
        ok: false,
        error: `Faltan campos obligatorios: ${errores.join(", ")}`,
      }),
    };
  }

  const fields = {
    "Nombre del comercio": nombreComercio,
    "Persona de contacto": personaContacto,
    "Peña / Filial": filial,
    "Rubro": rubro,
    "Descripción": descripcion,
    "Beneficio": beneficio,
    "Ciudad": ciudad,
    "Dirección": direccion,
    "WhatsApp": whatsapp,
    "Instagram": instagram,
    "Facebook": facebook,
    "Sitio web": sitioWeb,
    "Email": email,
    "Estado": "Pendiente",
    "Destacado": false,
  };

  try {
    console.log("FIELDS:", JSON.stringify(fields, null, 2));

    const res = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_NAME)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AIRTABLE_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          records: [
            {
              fields,
            },
          ],
        }),
      }
    );

    const out = await res.json();

    console.log("STATUS:", res.status);
    console.log("AIRTABLE:", JSON.stringify(out));

    if (!res.ok) {
      return {
        statusCode: 502,
        headers: cors,
        body: JSON.stringify({
          ok: false,
          error:
            out?.error?.message ||
            JSON.stringify(out),
        }),
      };
    }

    return {
      statusCode: 200,
      headers: cors,
      body: JSON.stringify({
        ok: true,
        id: out.records[0].id,
      }),
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
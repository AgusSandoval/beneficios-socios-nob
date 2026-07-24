// netlify/functions/submit-comercio.js
//
// Recibe el POST del formulario propio (sección #adherite de index.html)
// y crea el registro en Airtable usando un token de ESCRITURA que vive
// únicamente en el servidor (variable de entorno), nunca en el navegador.
//
// Variables de entorno a configurar en Netlify (Site settings > Environment
// variables):
//   AIRTABLE_WRITE_TOKEN  (obligatoria) — Personal Access Token de Airtable
//                          con alcance data.records:write sobre esta Base.
//   AIRTABLE_BASE_ID      (opcional, default: app4jSY7c4UJ14ILU)
//   AIRTABLE_TABLE_NAME   (opcional, default: "Negocios")
//
// El campo "Estado" siempre se fuerza a "Pendiente" acá adentro, sin
// importar qué mande el cliente — así ningún envío se auto-publica.

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
      body: JSON.stringify({ ok: false, error: "Método no permitido" }),
    };
  }

  const AIRTABLE_TOKEN = process.env.AIRTABLE_WRITE_TOKEN;
  const BASE_ID = process.env.AIRTABLE_BASE_ID || "app4jSY7c4UJ14ILU";
  const TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || "Negocios";

  if (!AIRTABLE_TOKEN) {
    return {
      statusCode: 500,
      headers: cors,
      body: JSON.stringify({
        ok: false,
        error: "Falta configurar AIRTABLE_WRITE_TOKEN en las variables de entorno de Netlify.",
      }),
    };
  }

  let data;
  try {
    data = JSON.parse(event.body || "{}");
  } catch (err) {
    return {
      statusCode: 400,
      headers: cors,
      body: JSON.stringify({ ok: false, error: "Cuerpo de la solicitud inválido." }),
    };
  }

  // Sanitizado básico: recorta espacios y evita objetos/arrays inesperados.
  const clean = (v) => (typeof v === "string" ? v.trim().slice(0, 500) : "");
  const persona = clean(data.persona);
  const negocio = clean(data.negocio);
  const rubro = clean(data.rubro);
  const filial = clean(data.filial);
  const descripcion = clean(data.descripcion).slice(0, 400);
  const descuento = clean(data.descuento);
  const zona = clean(data.zona);
  const contacto = clean(data.contacto);
  const instagram = clean(data.instagram);
  const facebook = clean(data.facebook);

  const errores = [];
  if (!persona) errores.push("Nombre y apellido");
  if (!negocio) errores.push("Nombre del comercio");
  if (!rubro) errores.push("Rubro");

  if (errores.length) {
    return {
      statusCode: 400,
      headers: cors,
      body: JSON.stringify({
        ok: false,
        error: `Faltan campos obligatorios: ${errores.join(", ")}.`,
      }),
    };
  }

  // Mapeo de datos del form -> nombres exactos de columnas en Airtable.
  // Si en tu tabla las columnas se llaman distinto, ajustá las claves
  // del lado izquierdo (los nombres deben coincidir con COLS en index.html).
  const fields = {
    "Nombre y Apellido": persona,
    "Nombre del negocio o servicio": negocio,
    "Peña / Filial": filial,
    "Rubro": rubro,
    "Descripción breve": descripcion,
    "Descuento para socios": descuento,
    "Zona / Barrio": zona,
    "WhatsApp o teléfono": contacto,
    "Instagram": instagram,
    "Facebook": facebook,
    "Estado": "Pendiente", // siempre Pendiente, nunca lo decide el cliente
  };

  try {
    const res = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_NAME)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AIRTABLE_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ records: [{ fields }] }),
      }
    );

    const out = await res.json();

    if (!res.ok) {
      const msg = (out && out.error && out.error.message) || "Airtable rechazó la solicitud.";
      return {
        statusCode: 502,
        headers: cors,
        body: JSON.stringify({ ok: false, error: msg }),
      };
    }

    return {
      statusCode: 200,
      headers: cors,
      body: JSON.stringify({ ok: true, id: out.records && out.records[0] && out.records[0].id }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: cors,
      body: JSON.stringify({ ok: false, error: "Error interno al conectar con Airtable." }),
    };
  }
};

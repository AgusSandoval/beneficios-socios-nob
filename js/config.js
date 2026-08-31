/* ===========================
   CONFIGURACIÓN
=========================== */

const CONFIG = {

    airtableBase: "",
    airtableTable: "",

    formUrl: "",

    penaWhatsapp: "",
    penaInstagram: "",
    penaFacebook: ""

};

/* ===========================
   CAMPOS DE AIRTABLE
=========================== */

const COLS = {

    "Nombre del comercio": "nombreComercio",
    "Persona de contacto": "personaContacto",

    "Rubro": "rubro",
    "Beneficio": "beneficio",
    "Descripción": "descripcion",

    "WhatsApp": "whatsapp",
    "Instagram": "instagram",
    "Facebook": "facebook",
    "Web": "web",

    "Dirección": "direccion",
    "Ciudad": "ciudad",
    "Filial": "filial",

    "Logo": "logo",

    "Latitud": "lat",
    "Longitud": "lng",

    "Estado": "estado",
    "Destacado": "destacado"

};

/* ===========================
   ESTADO DE LA APLICACIÓN
=========================== */

const APP = {

    items: [],

    filtros: {

        rubro: "Todos",
        busqueda: ""

    }

};
const CONFIG = {
    airtableBaseId: "app4jSY7c4UJ14ILU",
    airtableTableName: "Comercios",
    airtableToken: "",
    formUrl: "https://airtable.com/app4jSY7c4UJ14ILU/pagXsizU6VPWnzqy3/form",
    estadoAprobadoValor: "Aprobado",
    penaWhatsapp: "",
    penaInstagram: "",
    penaFacebook: "",
};

const COLS = {
    "Nombre del comercio": "nombreComercio",
    "Persona de contacto": "personaContacto",
    "Peña / Filial": "filial",
    "Rubro": "rubro",
    "Descripción": "descripcion",
    "Beneficio": "beneficio",
    "Ciudad": "ciudad",
    "Dirección": "direccion",
    "WhatsApp": "whatsapp",
    "Instagram": "instagram",
    "Facebook": "facebook",
    "Sitio web": "sitioWeb",
    "Email": "email",
    "Logo": "logo",
    "Estado": "estado",
    "Destacado": "destacado"
};

let ALL_ITEMS = [];
let activeRubro = "Todos";
let searchTerm = "";
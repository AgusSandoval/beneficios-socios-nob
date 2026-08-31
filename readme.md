# Beneficios Socios NOB — paquete de deploy

Este paquete tiene todo lo necesario para subir el sitio a Netlify:

```
index.html                          → la página (HTML + CSS + JS, un solo archivo)
netlify.toml                        → le dice a Netlify dónde están las funciones
netlify/functions/submit-comercio.js → función serverless para el alta de beneficios
```

## 1) Subir a Netlify

Como el formulario propio necesita una función serverless, **no sirve arrastrar
el archivo a Netlify Drop**. Hay que conectarlo como proyecto:

1. Subí esta carpeta completa (manteniendo la estructura de subcarpetas) a un
   repositorio de GitHub, GitLab o Bitbucket.
2. En [app.netlify.com](https://app.netlify.com) → **"Add new site" → "Import an
   existing project"** → elegí ese repositorio.
3. Netlify va a detectar `netlify.toml` solo. No hace falta build command
   (dejalo vacío o `echo "no build"`), y el "publish directory" es la raíz (`.`).

## 2) Variable de entorno para el alta de beneficios

En **Site settings → Environment variables**, agregá:

- `AIRTABLE_WRITE_TOKEN`: un Personal Access Token de Airtable con alcance
  **data.records:write** sobre tu Base (creado en airtable.com/create/tokens).
  Este token es distinto al de solo lectura que va dentro de `index.html`, y
  **nunca** debe pegarse en el HTML — solo acá, en Netlify.

Opcional, si tu Base o tabla tienen otro nombre:
- `AIRTABLE_BASE_ID` (por defecto usa el que ya está en el código: `app4jSY7c4UJ14ILU`)
- `AIRTABLE_TABLE_NAME` (por defecto `Negocios`)

## 3) Completar el CONFIG dentro de `index.html`

Buscá `const CONFIG = {` cerca del final del archivo (dentro del `<script>`) y completá:

```js
const CONFIG = {
  airtableBaseId: "app4jSY7c4UJ14ILU",   // ya cargado
  airtableTableName: "Negocios",          // ya cargado
  airtableToken: "",                      // <-- token de SOLO LECTURA (data.records:read)
  formUrl: "https://airtable.com/...",    // ya cargado (formulario clásico de respaldo)
  estadoAprobadoValor: "Aprobado",
  penaWhatsapp: "",                       // <-- WhatsApp oficial del programa
  penaInstagram: "",                      // <-- Instagram oficial del programa
  penaFacebook: "",                       // <-- Facebook oficial del programa
};
```

El `airtableToken` de acá arriba es de **solo lectura** (alcance
`data.records:read`) y es seguro tenerlo en el HTML porque cualquiera que
mire el código fuente solo puede leer el directorio público, nunca escribir.

## 4) Tabla en Airtable

La tabla se llama **Negocios** y necesita estas columnas (mismo nombre exacto):

| Columna                          | Tipo                          |
|-----------------------------------|-------------------------------|
| Nombre y Apellido                 | Texto                          |
| Nombre del negocio o servicio      | Texto                          |
| Peña / Filial                     | Texto (opcional, sin destacar ninguna) |
| Rubro                             | Single select (ver 9 categorías abajo) |
| Descripción breve                 | Texto largo                    |
| Descuento para socios             | Texto                          |
| Zona / Barrio                     | Texto                          |
| WhatsApp o teléfono                | Texto                          |
| Instagram                         | Texto                          |
| Facebook                          | Texto                          |
| Estado                            | Single select: Pendiente / Aprobado / Rechazado (default: Pendiente) |
| Logo                               | Attachment (opcional)          |
| Latitud / Longitud                 | Number con decimales (opcional, para el mapa) |

**Rubro — las 9 opciones exactas** (con el emoji, para que los filtros del
directorio coincidan con el formulario):

```
🏠 Hogar y Construcción
👨‍💼 Servicios Profesionales
🍽️ Gastronomía
❤️ Salud y Bienestar
🚗 Automotor
🎓 Educación
💻 Tecnología
🛍️ Comercios
🎉 Ocio y Entretenimiento
```

## 5) Moderación

Todo lo que entra por el formulario (propio o el clásico de Airtable) cae en
la tabla con **Estado = Pendiente**. No se ve en la página pública hasta que,
desde la tabla de Airtable, cambiás manualmente ese Estado a **Aprobado**.

## 6) ¿Cómo prueba uno que la función anda?

Una vez desplegado, entrá a la sección "Sumate a la plataforma" del sitio y
completá el formulario. Si la función está bien configurada, vas a ver el
mensaje "¡Listo! Tu comercio quedó cargado y en revisión." y la fila va a
aparecer en Airtable con Estado = Pendiente. Si ves un error, revisá que
`AIRTABLE_WRITE_TOKEN` esté cargado en Netlify y que el nombre de la tabla
coincida.

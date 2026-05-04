# Procedimiento de Produccion — Tablero PAC
## Modelo de Eficiencia Comercial — Ariel Tarnaruder Consultor

---

## INDICE

1. Generar el HTML del cliente
2. Subir a GitHub
3. Crear sitio en Netlify
4. Configurar Google Sheet
5. Configurar Google Apps Script
6. Conectar el tablero al Sheet (modo produccion)
7. Entrega al cliente
8. Mantenimiento

---

## PASO 1 — GENERAR EL HTML DEL CLIENTE

**Prerequisito:** tener el Excel_maestro.xlsx completado con los programas, planes y tareas del cliente.

1. Abrir chat nuevo en Claude
2. Pegar el contenido de `prompt_maestro.md`
3. Decir: "Quiero hacer un tablero para [NOMBRE CLIENTE]"
4. Responder las preguntas de Claude (colores, roles, zonas)
5. Claude genera el HTML completo
6. Descargar el archivo inmediatamente (no esperar — los archivos no se guardan solos)

**Verificar antes de continuar:**
- El tablero abre en el browser sin errores
- El login funciona con los PINs de prueba
- Los programas y tareas se ven correctamente
- La edicion de avance funciona

---

## PASO 2 — SUBIR A GITHUB

**Estructura de carpetas en el repo:**

```
Consultor-tableros/
  toolkit/
    prompt_maestro.md
    procedimiento_produccion.md
    demo_tablero.html
    Excel_maestro.xlsx
  clientes/
    gdm/
      index.html
    [nuevo_cliente]/
      index.html
```

**Como subir un archivo nuevo a GitHub (sin usar terminal):**

1. Ir a github.com/arieltarnaruder/Consultor-tableros
2. Navegar a la carpeta `clientes/`
3. Hacer clic en "Add file" > "Create new file"
4. En el campo de nombre escribir: `[nombre_cliente]/index.html`
   (GitHub crea la carpeta automaticamente)
5. Pegar el contenido del HTML generado por Claude
6. Hacer clic en "Commit changes"
7. Agregar mensaje: "Agrego tablero [nombre cliente]"

**Para actualizar un archivo existente:**

1. Ir al archivo en GitHub
2. Hacer clic en el icono del lapiz (Edit)
3. Reemplazar el contenido
4. Commit changes

---

## PASO 3 — CREAR SITIO EN NETLIFY

1. Ir a netlify.com e iniciar sesion con el Gmail de Ariel
2. Hacer clic en "Add new site" > "Import an existing project"
3. Conectar con GitHub
4. Seleccionar el repo `Consultor-tableros`
5. En "Base directory" escribir: `clientes/[nombre_cliente]`
6. En "Publish directory" dejar vacio (o escribir `.`)
7. Hacer clic en "Deploy site"

**Cambiar el nombre del sitio:**
- Site settings > Site details > Change site name
- Poner: `tablero-[cliente]` (ej: `tablero-gdm`)
- URL resultante: `tablero-[cliente].netlify.app`

**Verificar:**
- Abrir la URL publica
- Confirmar que carga el tablero correctamente

**Nota:** Netlify actualiza el sitio automaticamente cada vez que se hace un commit en GitHub en esa carpeta. No hay que hacer nada mas.

---

## PASO 4 — CONFIGURAR GOOGLE SHEET

1. Crear un Google Sheet nuevo en el Drive del cliente (o en el de Ariel si el cliente no tiene)
2. Nombrar el archivo: `PAC [Nombre Cliente] — Datos Tablero`
3. Crear dos hojas con estos nombres exactos:

**Hoja "Tareas"** — columnas en este orden exacto:

| Col A | Col B | Col C | Col D | Col E | Col F | Col G | Col H | Col I | Col J | Col K |
|---|---|---|---|---|---|---|---|---|---|---|
| programa | plan | tarea | responsable | estado | prioridad | avance | fechaVencimiento | comentarios | zonas_json | ultimaActualizacion |

Fila 1 = encabezados (los nombres de arriba)
Fila 2 en adelante = datos

**Hoja "Usuarios"** — columnas en este orden exacto:

| Col A | Col B | Col C | Col D | Col E |
|---|---|---|---|---|
| id | nombre | rol | zona | pin |

4. Cargar los datos de tareas copiando desde el Excel_maestro.xlsx
5. Cargar los usuarios con sus PINs iniciales
6. Anotar el ID del Sheet (esta en la URL: `docs.google.com/spreadsheets/d/[SHEET_ID]/edit`)

**Permisos del Sheet:**
- El Sheet debe ser privado (no publico)
- Compartir con la cuenta de Google que usara Apps Script
- La API Key de lectura se configura en el siguiente paso

---

## PASO 5 — CONFIGURAR GOOGLE APPS SCRIPT

El Apps Script es el "puente" que permite al tablero escribir cambios de vuelta al Sheet.

**Crear el script:**

1. Dentro del Google Sheet ir a: Extensiones > Apps Script
2. Borrar el codigo que aparece por defecto
3. Pegar el siguiente codigo:

```javascript
const SHEET_ID = 'TU_SHEET_ID_ACA';
const SECRET = 'clave_secreta_que_vos_eliges';

function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
    
    if (params.secret !== SECRET) {
      return ContentService.createTextOutput(
        JSON.stringify({ ok: false, error: 'Unauthorized' })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName('Tareas');
    const rowIndex = params.rowIndex; // fila a actualizar (numero)
    
    // Actualizar columnas: E=estado, F=prioridad, G=avance, I=comentarios, J=zonas, K=timestamp
    sheet.getRange(rowIndex, 5).setValue(params.estado);
    sheet.getRange(rowIndex, 6).setValue(params.prioridad);
    sheet.getRange(rowIndex, 7).setValue(params.avance);
    sheet.getRange(rowIndex, 9).setValue(params.comentarios);
    sheet.getRange(rowIndex, 10).setValue(params.zonas_json || '');
    sheet.getRange(rowIndex, 11).setValue(params.ultimaActualizacion);
    
    return ContentService.createTextOutput(
      JSON.stringify({ ok: true })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch(err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // Endpoint de lectura (para verificar que el script funciona)
  return ContentService.createTextOutput(
    JSON.stringify({ ok: true, status: 'Apps Script activo' })
  ).setMimeType(ContentService.MimeType.JSON);
}
```

4. Reemplazar `TU_SHEET_ID_ACA` con el ID del Sheet del paso anterior
5. Reemplazar `clave_secreta_que_vos_eliges` con una clave propia (ej: `pac2026gdm`)
6. Guardar (Ctrl+S)

**Publicar el script:**

1. Hacer clic en "Implementar" > "Nueva implementacion"
2. Tipo: "Aplicacion web"
3. Ejecutar como: "Yo" (tu cuenta de Google)
4. Quienes tienen acceso: "Cualquier usuario"
5. Hacer clic en "Implementar"
6. Copiar la URL que aparece — esta es la APPS_SCRIPT_URL

**Importante:** cada vez que modifiques el codigo del script hay que crear una nueva implementacion (no actualizar la existente) para que los cambios tomen efecto.

---

## PASO 6 — CONECTAR EL TABLERO AL SHEET

En el HTML del cliente, al inicio del script hay una seccion comentada para produccion.
Reemplazar los valores de configuracion:

```javascript
// MODO PRODUCCION — descomentar y completar estos valores
const CONFIG_PRODUCCION = {
    SHEET_ID: 'el_id_de_tu_sheet',
    API_KEY: 'tu_api_key_de_google_cloud',
    APPS_SCRIPT_URL: 'la_url_del_apps_script',
    MODO: 'produccion'  // cambiar de 'demo' a 'produccion'
};
```

**Como obtener la API Key de Google Cloud:**

1. Ir a console.cloud.google.com
2. Crear un proyecto nuevo (o usar uno existente)
3. Ir a "APIs y servicios" > "Credenciales"
4. Crear credencial > Clave de API
5. Restringir la clave a: Google Sheets API
6. Agregar restriccion de HTTP referrer: `*.netlify.app/*`
7. Copiar la clave

**Verificar la conexion:**
1. Subir el HTML actualizado a GitHub
2. Netlify despliega automaticamente
3. Abrir el tablero
4. Editar una tarea y guardar
5. Verificar que el cambio aparece en el Google Sheet

---

## PASO 7 — ENTREGA AL CLIENTE

**Que entregar:**

1. URL del tablero (ej: `tablero-gdm.netlify.app`)
2. Lista de usuarios con sus PINs iniciales (en sobre cerrado o mensaje privado)
3. Tutorial de usuario (ver `/toolkit/tutorial_usuario.pdf` si existe)
4. Reunion de capacitacion de 30-45 minutos con el equipo

**En la reunion de capacitacion cubrir:**
- Como entrar y navegar el tablero
- Como cargar avance en una tarea
- Como usar la grilla de zonas (para RZN)
- Como cambiar el PIN
- Que hacer si olvidaron el PIN (llamar al consultor)
- Frecuencia esperada de actualizacion

**PINs iniciales recomendados:**
- Director: elegir con el cliente en la reunion
- Vendedores: numero de zona repetido (1111, 2222, etc.) — pedirles que lo cambien en el primer login

---

## PASO 8 — MANTENIMIENTO

**Agregar o modificar tareas:**
- Editar directamente el Google Sheet (columnas A a I)
- No es necesario tocar el codigo

**Agregar usuarios:**
- Panel Admin en el tablero (solo el director tiene acceso)
- O editar directamente la hoja "Usuarios" del Sheet

**Resetear un PIN:**
- Panel Admin > Reset PIN (solo director)

**Actualizar el codigo del tablero:**
- Generar nuevo HTML con Claude (pegar prompt_maestro.md primero)
- Subir a GitHub — Netlify actualiza solo

**Si el tablero no carga:**
1. Verificar que el repo de GitHub tiene el index.html en la carpeta correcta
2. Verificar en Netlify que el ultimo deploy fue exitoso (sin errores)
3. Limpiar cache del browser (Ctrl+Shift+R)

**Si los cambios no se guardan:**
1. Verificar que el Apps Script esta publicado correctamente
2. Verificar que la URL del script en el HTML es la correcta
3. Abrir la consola del browser (F12) y ver si hay errores

---

## TIEMPOS ESTIMADOS

| Tarea | Tiempo |
|---|---|
| Generar HTML con Claude | 10-15 min |
| Subir a GitHub + Netlify | 10 min |
| Configurar Sheet + Apps Script | 20-30 min |
| Verificar y ajustar | 15 min |
| **Total implementacion tecnica** | **~1 hora** |
| Reunion de capacitacion | 45 min |

---

*Ultima actualizacion: Mayo 2026*
*Consultor: Ariel Tarnaruder*

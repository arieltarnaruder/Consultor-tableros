# Prompt Maestro — Toolkit Tablero PAC
## Modelo de Eficiencia Comercial — Ariel Tarnaruder Consultor

---

## INSTRUCCIONES DE USO

Pegar este documento al inicio de un chat nuevo en Claude y decir:
"Quiero hacer un tablero para [NOMBRE CLIENTE]"

Claude ya tiene todo el contexto para arrancar sin preguntas repetidas.

---

## QUE ES ESTE PRODUCTO

Un tablero web de seguimiento de Plan de Accion Comercial (PAC).
Parte de una metodologia de consultoría llamada Modelo de Eficiencia Comercial, que tiene 4 fases:

1. Gestion del PAC — estructurar Programas > Planes > Tareas con responsables
2. Tablero de Control — este producto
3. Esquema de Operacion — reuniones, frecuencia, mecanica
4. Implementacion — capacitacion y acompanamiento

El tablero es la herramienta de seguimiento de la Fase 2. Permite que el equipo comercial cargue avances, vea el estado del plan y tome decisiones en reuniones.

---

## ARQUITECTURA DEL SISTEMA (decisiones ya tomadas, no reabrir)

| Componente | Tecnologia | Razon |
|---|---|---|
| Frontend | HTML + React (Babel, sin build) | Un solo archivo, sin infraestructura |
| Base de datos | Google Sheets | Sin IT, el cliente lo gestiona solo |
| Bridge escritura | Google Apps Script (~20 lineas) | Sin servidor, gratis |
| Hosting | Netlify (plan gratuito) | Deploy automatico desde GitHub |
| Auth | PIN de 4 digitos | Simple, sin SSO ni Active Directory |

**Repo GitHub:** `arieltarnaruder/Consultor-tableros`
**Cuenta Netlify:** Gmail de Ariel

---

## ESTRUCTURA DE DATOS

Cada fila del Google Sheet (y del array DEMO en el HTML) representa una tarea:

| Campo | Tipo | Notas |
|---|---|---|
| programa | string | Nivel 1 de jerarquia |
| plan | string | Nivel 2 |
| tarea | string | Nivel 3 |
| responsable | string | Puede ser compuesto: "SR PM DC". Si incluye "rzn" + "x 9" es colectivo |
| estado | string | "Pendiente" / "En curso" / "Bloqueada" / "Cerrada" |
| prioridad | string | "Alta" / "Media" / "Baja" |
| avance | number | 0.0 a 1.0 |
| fechaVencimiento | string | ISO date o texto libre ("Semanal") |
| comentarios | string | Texto libre |

**Campo especial — RZN colectivo:**
Si responsable contiene "rzn" Y ("x 9" o "x9"), la tarea tiene avance por zona.
Cada zona guarda: { avance, estado, comentario }
El avance general de la tarea es el promedio de las 9 zonas.

---

## ROLES Y PERMISOS

- **Rol "director"** (o equivalente): ve y edita todo
- **Rol "rzn"**: edita solo tareas donde su rol aparece en Responsable, y solo su zona en tareas RZN colectivas
- **Otros roles** (pm, dc, marketing, etc.): editan tareas donde su rol aparece en Responsable
- **Sin login**: solo lectura

La deteccion es por string matching: si el campo responsable de la tarea contiene el string del rol del usuario, puede editar.

---

## SEMAFORO DE AVANCE (universal, no cambiar)

| Color | Rango | Label |
|---|---|---|
| Rojo | 0-9% | Sin inicio |
| Naranja | 10-49% | Iniciado |
| Amarillo | 50-79% | En marcha |
| Verde | 80-99% | Avanzado |
| Azul | 100% | Completa |

---

## OBJETO CLIENTE (lo unico que cambia por cliente en el codigo)

```javascript
const CLIENTE = {
    nombre: "Nombre de la empresa",
    subtitulo: "Plan de Accion Comercial · Campaña XXXX",
    colorA: "#E05A1B",   // color primario (botones, accents)
    colorB: "#2E7D32",   // color secundario (header, guardado)
    colorC: "#F5C800",   // color terciario (gradiente header)
    logo: null,          // null = usa LogoCliente SVG inline
};
```

---

## ZONAS

Por defecto 9 zonas: "Zona 1" a "Zona 9".
Si el cliente tiene menos zonas o nombres distintos, se cambia el array ZONAS y los usuarios RZN.
Si el cliente no tiene estructura de zonas, se elimina la logica RZN colectivo y la vista Equipos se simplifica.

---

## VISTAS DEL TABLERO

| Vista | Descripcion |
|---|---|
| Resumen | KPIs generales + avance por programa |
| Programas | Drill-down Programa > Plan > Tarea |
| Planes | Todos los planes expandibles con filtro por programa |
| Equipos | Zonas RZN (ranking + drill-down) + otros responsables |
| Tareas | Lista completa con filtros multiples |

---

## USUARIOS DEMO (estructura)

```javascript
{ id: "dir", nombre: "Nombre", rol: "director", zona: null, pin: "1234", email: "..." }
{ id: "rzn1", nombre: "Zona 1", rol: "rzn", zona: "Zona 1", pin: "1111", email: "..." }
```

El rol "director" equivale al "sr" de GDM — el que ve y edita todo.

---

## CLIENTE DE REFERENCIA: GDM (Don Mario Semillas)

- **Repo:** `arieltarnaruder/Consultor-tableros` (rama main, archivo `index.html`)
- **URL produccion:** tablerogdm.netlify.app
- **Contacto:** Sebastian Rios (SR) — director comercial
- **Campana:** Soja 25/26
- **Estructura:** 6 programas, ~15 planes, ~40 tareas
- **Zonas:** 9 zonas RZN
- **Roles:** SR, RZN, PM, DC, Marketing
- **Colores:** naranja #E05A1B, verde #2E7D32, amarillo #F5C800
- **Estado:** produccion — NO tocar el index.html de GDM sin respaldo previo

---

## ARCHIVO DE REFERENCIA: DEMO

- **Archivo:** `/toolkit/demo_tablero.html`
- **Uso:** pitch a clientes nuevos, demos sin datos reales
- **Datos:** genericos, sin referencia a ningun cliente
- **Logo:** SVG con texto "DEMO"
- **PIN director:** 1234 / zonas: 1111 a 9999

---

## EXCEL MAESTRO

- **Archivo:** `/toolkit/Excel_maestro.xlsx`
- **Hoja principal:** "Detalle de Tareas"
- **Columnas:** ID_Programa | ID_Plan | ID_Tarea | Responsable | Estado_Tarea | Prioridad | %_Avance | Fecha_Vencimiento | Comentarios
- **Uso:** completar con el cliente durante el trabajo de la Fase 1 (diseno del PAC)
- **Flujo:** Excel completado → copiar datos al array DEMO del HTML del cliente

---

## PROCEDIMIENTO PARA CLIENTE NUEVO

Ver `/toolkit/procedimiento_produccion.md` para el paso a paso completo.

Resumen:
1. Trabajar Fase 1 con el cliente usando Excel_maestro.xlsx
2. Abrir chat nuevo en Claude, pegar este prompt
3. Decir: "Quiero hacer un tablero para [CLIENTE]"
4. Responder las preguntas de Claude sobre branding y estructura
5. Claude genera el HTML del cliente
6. Subir a GitHub en `/clientes/[nombre_cliente]/index.html`
7. Crear sitio en Netlify conectado a esa carpeta
8. Configurar Google Sheet + Apps Script para produccion

---

## RESTRICCIONES TECNICAS CONOCIDAS

- **Limite de tamano del HTML:** no superar ~130KB. Por encima el renderer de Claude falla y el deploy de Netlify puede tener problemas. Mantener datos DEMO acotados.
- **Sin emojis en el HTML:** el parser de Babel en browser-mode no los procesa correctamente. Usar texto plano o simbolos ASCII.
- **Sin base64 en el HTML:** mismo problema con Babel. Logos van como SVG inline.
- **Sin localStorage:** no soportado en artifacts de Claude. Todo el estado va en memoria React.
- **Babel browser-mode:** no usar imports ni exports. Todo en un solo script tag.

---

## PREGUNTAS A HACER AL CLIENTE NUEVO

Cuando Ariel diga "quiero un tablero para X", preguntar:

1. **Nombre de la empresa** y **subtitulo** (ej: "Plan Comercial Campana 2026")
2. **Colores de marca** (primario, secundario) — si no los sabe, proponer
3. **Nombre del director / responsable principal** (equivalente a SR en GDM)
4. **Cuantas zonas** tiene el equipo de ventas y como se llaman
5. **Que otros roles** participan ademas del director y los vendedores
6. **Tiene el Excel completado?** Si si, pedirlo. Si no, completarlo primero.

Con esa informacion Claude puede generar el HTML completo del cliente en una sola iteracion.

---

## NOTAS DEL CONSULTOR

- Los proyectos de Claude NO guardan archivos generados automaticamente. Siempre descargar y subir a GitHub inmediatamente despues de generar un archivo.
- Bajio y Agrys tienen sus propios proyectos en Claude pero NO estan en GitHub. Sus tableros no son parte de este toolkit.
- Este toolkit vive en `/toolkit/` dentro del repo `arieltarnaruder/Consultor-tableros`.
- Backup en Google Drive y disco local.

/**
 * Pegá este bloque en tu Google Apps Script (Web App).
 * Hoja esperada con columnas:
 * dia | premio | ganador | imagen | revelar_desde | activo
 *
 * En doPost, agregá:
 *   if (action === "getAdventCalendar") {
 *     return jsonResponse(getAdventCalendar());
 *   }
 */

var ADVENT_CALENDAR_SHEET_NAME = "CalendarioAdviento";

function getAdventCalendar() {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
      ADVENT_CALENDAR_SHEET_NAME
    );

    if (!sheet) {
      return {
        ok: false,
        message:
          'No se encontró la hoja "' + ADVENT_CALENDAR_SHEET_NAME + '"',
      };
    }

    var values = sheet.getDataRange().getValues();
    if (values.length < 2) {
      return { ok: true, days: [] };
    }

    var headers = values[0].map(function (header) {
      return String(header).trim().toLowerCase();
    });

    var days = [];

    for (var i = 1; i < values.length; i++) {
      var row = values[i];
      var item = {};

      for (var j = 0; j < headers.length; j++) {
        item[headers[j]] = row[j];
      }

      if (!item.dia) continue;

      days.push({
        dia: item.dia,
        premio: item.premio || "",
        ganador: item.ganador || "",
        imagen: item.imagen || "",
        revelar_desde: formatAdventRevealDate(item.revelar_desde),
        activo: item.activo,
      });
    }

    return { ok: true, days: days };
  } catch (error) {
    return {
      ok: false,
      message: error.message || "Error al leer el calendario de adviento",
    };
  }
}

function formatAdventRevealDate(value) {
  if (!value) return "";

  if (Object.prototype.toString.call(value) === "[object Date]" && !isNaN(value)) {
    return Utilities.formatDate(
      value,
      Session.getScriptTimeZone(),
      "yyyy-MM-dd'T'HH:mm:ss"
    );
  }

  return String(value);
}

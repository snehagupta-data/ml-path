// ─── Minimal CSV parser (no dependencies) ────────────────────────────────
// Handles quoted fields containing commas, escaped double quotes (""),
// and CRLF / LF line endings. Headers are trimmed; missing trailing
// fields become empty strings.

export interface ParsedCsv {
  headers: string[];
  rows: Record<string, string>[];
}

export function parseCsv(text: string): ParsedCsv {
  const rawRows: string[][] = [];
  let field = '';
  let row: string[] = [];
  let inQuotes = false;
  let i = 0;

  const pushField = () => {
    row.push(field);
    field = '';
  };
  const pushRow = () => {
    pushField();
    rawRows.push(row);
    row = [];
  };

  while (i < text.length) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
        } else {
          inQuotes = false;
          i += 1;
        }
      } else {
        field += ch;
        i += 1;
      }
    } else if (ch === '"') {
      inQuotes = true;
      i += 1;
    } else if (ch === ',') {
      pushField();
      i += 1;
    } else if (ch === '\r') {
      if (text[i + 1] === '\n') i += 1;
      pushRow();
      i += 1;
    } else if (ch === '\n') {
      pushRow();
      i += 1;
    } else {
      field += ch;
      i += 1;
    }
  }
  // Flush any trailing content (a file not ending in a newline).
  if (field.length > 0 || row.length > 0) pushRow();

  const rows = rawRows.filter((r) => r.some((c) => c.trim() !== ''));
  if (rows.length === 0) return { headers: [], rows: [] };

  const headers = rows[0].map((h) => h.trim());
  const parsed: Record<string, string>[] = rows.slice(1).map((r) => {
    const record: Record<string, string> = {};
    headers.forEach((h, idx) => {
      record[h] = r[idx] ?? '';
    });
    return record;
  });
  return { headers, rows: parsed };
}

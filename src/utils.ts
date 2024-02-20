import { formatTable } from "./utils_extern";

export function create(input: string, columnsNumber: number): string {
  let table = '';
  table = input.trim();
  const multipleNewLines = /\n\n+/;
  const columns = table.split(multipleNewLines);
  if(columns.length === columnsNumber) {
    // columns are already structured by newline
    let rows: string[] = [];
    for(let index = 0; index < columns[0].split(/\n/).length; index++) {
      rows.push('');
    }
    columns.forEach(column => column.split(/\n/).forEach((rowCell, index) => rows[index] = rows[index] + "|" + rowCell));
    let headerRow = '';
    for(let index = 0; index < columnsNumber; index++) {
      headerRow = headerRow + ('|:---');
    }
    rows.splice(1, 0, headerRow);
    table = rows.join('\n');
  } else {
    // columns are already structured by newline
  }
  table = formatTable(table);
  return table; 
}

// Remove white spaces for tests
export function clean(input: string): string {
  let removed = '';
  removed = input
    .trim()
    .split('\n')
    .map((line) => line.trimStart())
    .join('\n');
  return removed;
}
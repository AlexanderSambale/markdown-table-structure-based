import { formatTable } from "./vscode-markdown/utils_extern";

export function create(input: string, columnsNumber: number): string {
  let table = '';
  table = input.trim();
  const multipleNewLines = /\n\n+/;
  const columns = table.split(multipleNewLines);
  let headerRow = '';
  for(let index = 0; index < columnsNumber; index++) {
    headerRow = headerRow + ('|:---');
  }
  let rows: string[] = [];
  if(columns.length === columnsNumber) {
    // columns are already structured by newline
    for(let index = 0; index < columns[0].split(/\n/).length; index++) {
      rows.push('');
    }
    columns.forEach(column => column.split(/\n/).forEach((rowCell, index) => rows[index] = rows[index] + "|" + rowCell));
  } else if (columns.length === 1){
    // each cell is on a newline, ordered by first row, second and so on
    const cells = table.split('\n');
    let row: string;
    for(let rowIndex = 0; rowIndex*columnsNumber < cells.length; rowIndex++) {
      row = '';
      for(let columnIndex = 0; columnIndex < columnsNumber; columnIndex++){
        if(rowIndex*columnsNumber+columnIndex < cells.length) {
          row = row + cells[rowIndex*columnsNumber+columnIndex] + '|';
        } else {
          row = row + '|';
        }
      }
      rows.push(row);
    }
  }
  rows.splice(1, 0, headerRow);
  table = rows.join('\n');
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
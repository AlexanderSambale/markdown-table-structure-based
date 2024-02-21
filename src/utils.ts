import { formatTable } from "./vscode-markdown/utils_extern";

const multipleNewLines = /\n\n+/;
const EOL = '\n';

export function create(input: string, columnsNumber: number): string {
  let table = '';
  table = input.trim();
  const columns = table.split(multipleNewLines);
  let headerRow = '';
  for(let index = 0; index < columnsNumber; index++) {
    headerRow = headerRow + ('|:---');
  }
  let rows: string[] = [];
  if(columns.length === columnsNumber) {
    // columns are already structured by newline
    for(let index = 0; index < columns[0].split(EOL).length; index++) {
      rows.push('');
    }
    columns.forEach(column => column.split(EOL).forEach((rowCell, index) => rows[index] = rows[index] + "|" + rowCell));
  } else if (columns.length === 1){
    // each cell is on a newline, ordered by first row, second and so on
    const cells = table.split(EOL);
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
  table = rows.join(EOL);
  table = formatTable(table);
  return table; 
}

// Remove white spaces for tests
export function clean(input: string): string {
  let removed = '';
  removed = input
    .trim()
    .split(EOL)
    .map((line) => line.trimStart())
    .join(EOL);
  return removed;
}

/**
 * concatenates markdown tables
 * adds columns of the other tables to the first
 * @param tablesInput 
 * @returns 
 */
export function concat(tablesInput: string): string {
  const tables = tablesInput
    .trim()
    .split(multipleNewLines);
  const numberOfTables = tables.length;
  let maxRowNumber = 0;
  let cells: string[][] = []; // first table, then row
  let rows: string[] = [];
  const numberOfColumns: number[] = []; 
  for(let tableIndex = 0; tableIndex < numberOfTables; tableIndex++){
    rows = tables[tableIndex].split(EOL);
    maxRowNumber = Math.max(maxRowNumber, rows.length); 
    numberOfColumns.push(numberOfMatches(rows[0], /\|/g)-1); // we assume | ... | ... |
    cells.push(rows);
  }
  let row: string;
  rows = [];
  for(let rowIndex = 0; rowIndex < maxRowNumber; rowIndex++) {
    row = '';
    for(let tableIndex = 0; tableIndex < numberOfTables; tableIndex++){
      if(cells[tableIndex][rowIndex]) {
        // table has rows to add 
        row = row + cells[tableIndex][rowIndex].replace(/\|$/, '');
      } else {
        // table has no more rows, then fill with empty cells
        row = row + '| '.repeat(numberOfColumns[tableIndex]);
      }
    }
    rows.push(row + '|');
  }
  let mergedTable = rows.join(EOL);
  mergedTable = formatTable(mergedTable);
  return mergedTable;
}

function numberOfMatches(input: string,
  matcher: RegExp): number {
  const matches = input.matchAll(matcher);
  return [...matches].length ;
}
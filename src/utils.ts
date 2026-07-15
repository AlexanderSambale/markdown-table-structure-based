import { formatTable } from "./vscode-markdown/utils_extern";
import { multipleNewLines, EOL} from "./constants";

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
  return concatenate(tables);
}

/**
 * concatenates markdown tables
 * adds columns of the other tables to the first
 * @param tablesInput 
 * @returns 
 */
export function concatenate(tables: string[]): string {

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

export function concatReverse(tablesInput: string): string {
  const tables = tablesInput
  .trim()
  .split(multipleNewLines)
  .reverse();
  return concatenate(tables);
}

export function toLines(tableInput: string): string {
  const rows = tableInput.trim().split(EOL);

  if (rows.length < 2) {
    return tableInput;
  }

  // Read cells row by row, skipping delimiter row (index 1)
  const cells: string[] = [];

  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    if (rowIndex === 1) {
      continue; // skip delimiter row
    }
    let row = rows[rowIndex].trim();
    if (row.startsWith('|')) {
      row = row.substring(1);
    }
    if (row.endsWith('|')) {
      row = row.substring(0, row.length - 1);
    }
    const rowCells = row.split('|').map(cell => cell.trim());
    // Push cells in row order
    for (const cell of rowCells) {
      cells.push(cell);
    }
  }

  return cells.join(EOL);
}

export function transpose(tableInput: string): string {
  const rows = tableInput.trim().split(EOL);
  
  if (rows.length < 2) {
    return tableInput;
  }

  const cells: string[][] = [];
  
  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    if (rowIndex === 1) {
      continue;
    }
    let row = rows[rowIndex].trim();
    if (row.startsWith('|')) {
      row = row.substring(1);
    }
    if (row.endsWith('|')) {
      row = row.substring(0, row.length - 1);
    }
    const rowCells = row.split('|').map(cell => cell.trim());
    cells.push(rowCells);
  }

  if (cells.length === 0 || cells[0].length === 0) {
    return tableInput;
  }

  const maxColumns = Math.max(...cells.map(row => row.length));
  
  const transposed: string[][] = [];
  
  for (let colIndex = 0; colIndex < maxColumns; colIndex++) {
    const newRow: string[] = [];
    for (let rowIndex = 0; rowIndex < cells.length; rowIndex++) {
      if (colIndex < cells[rowIndex].length) {
        newRow.push(cells[rowIndex][colIndex]);
      } else {
        newRow.push('');
      }
    }
    transposed.push(newRow);
  }

  let resultRows: string[] = [];
  for (let rowIndex = 0; rowIndex < transposed.length; rowIndex++) {
    resultRows.push('|' + transposed[rowIndex].join('|') + '|');
  }

  let delimiterRow = '';
  for (let colIndex = 0; colIndex < transposed[0].length; colIndex++) {
    delimiterRow += '|:---';
  }
  delimiterRow += '|';

  resultRows.splice(1, 0, delimiterRow);

  let result = resultRows.join(EOL);
  result = formatTable(result);
  return result;
}
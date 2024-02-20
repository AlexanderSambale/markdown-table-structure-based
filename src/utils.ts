import { formatTable } from "./utils_extern";

export function create(input: string, columns: number): string {
  let table = '';
  table = formatTable(input);
  return table; 
}

// Remove whitespaces for tests
export function clean(input: string): string {
  let removed = '';
  removed = input
    .trim()
    .split('\n')
    .map((line) => line.trimStart())
    .join('\n');
  return removed;
}
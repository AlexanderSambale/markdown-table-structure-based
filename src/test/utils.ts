import { EOL } from "../constants";

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
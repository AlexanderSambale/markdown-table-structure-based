// This file uses code from <https://github.com/yzhang-gh/vscode-markdown/>
// Especially functions from https://github.com/yzhang-gh/vscode-markdown/blob/d2862ca363656c244ff587e6ce17e875e02457ed/src/tableFormatter.ts
// Only small adjustments were done

import { FormattingOptions, EndOfLine } from "vscode";
import GraphemeSplitter = require('grapheme-splitter');

const splitter = new GraphemeSplitter();

enum ColumnAlignment {
  None,
  Left,
  Center,
  Right
}

function getTableIndentation(text: string, options: FormattingOptions) {
  //let doNormalize = configManager.get("tableFormatter.normalizeIndentation");
  const doNormalize = true;
  let indentRegex = new RegExp(/^(\s*)\S/u);
  let match = text.match(indentRegex);
  let spacesInFirstLine = match?.[1].length ?? 0;
  let tabStops = Math.round(spacesInFirstLine / options.tabSize);
  let spaces = doNormalize ? " ".repeat(options.tabSize * tabStops) : " ".repeat(spacesInFirstLine);
  return spaces;
}

export function formatTable(input: string , options: FormattingOptions = { tabSize: 2 , insertSpaces: false }, eol = EndOfLine.LF) {
  // The following operations require the Unicode Normalization Form C (NFC).
  const text = input.normalize();

  const delimiterRowIndex = 1;
  // const delimiterRowNoPadding = configManager.get('tableFormatter.delimiterRowNoPadding');
  const delimiterRowNoPadding = true;
  const indentation = getTableIndentation(text, options);

  const rowsNoIndentPattern = new RegExp(/^\s*(\S.*)$/gum);
  const rows: string[] = Array.from(text.matchAll(rowsNoIndentPattern), (match) => match[1].trim());

  // Desired "visual" width of each column (the length of the longest cell in each column), **without padding**
  const colWidth: number[] = [];
  // Alignment of each column
  const colAlign: ColumnAlignment[] = [];
  // Regex to extract cell content.
  // GitHub #24
  const fieldRegExp = new RegExp(/((\\\||[^\|])*)\|/gu);
  // https://www.ling.upenn.edu/courses/Spring_2003/ling538/UnicodeRanges.html
  const cjkRegex = /[\u3000-\u9fff\uac00-\ud7af\uff01-\uff60]/g;

  const lines = rows.map((row, iRow) => {
      // Normalize
      if (row.startsWith('|')) {
          row = row.slice(1);
      }
      if (!row.endsWith('|')) {
          row = row + '|';
      }

      // Parse cells in the current row
      let values = [];
      let iCol = 0;
      for (const field of row.matchAll(fieldRegExp)) {
          let cell = field[1].trim();
          values.push(cell);

          // Ignore the length of delimiter-line before we normalize it
          if (iRow === delimiterRowIndex) {
              continue;
          }

          // Calculate the desired "visual" column width.
          // The following notes help to understand the precondition for our calculation.
          // They don't reflect how text layout engines really work.
          // For more information, please consult UAX #11.
          // A grapheme cluster may comprise multiple Unicode code points.
          // One CJK grapheme consists of one CJK code point, in NFC.
          // In typical fixed-width typesetting without ligature, one grapheme is finally mapped to one glyph.
          // Such a glyph is usually the same width as an ASCII letter, but a CJK glyph is twice.

          const graphemeCount = splitter.countGraphemes(cell);
          const cjkPoints = cell.match(cjkRegex);
          const width = graphemeCount + (cjkPoints?.length ?? 0);
          colWidth[iCol] = Math.max(colWidth[iCol] || 0, width);

          iCol++;
      }
      return values;
  });

  // Normalize the num of hyphen according to the desired column length
  lines[delimiterRowIndex] = lines[delimiterRowIndex].map((cell, iCol) => {
      if (/:-+:/.test(cell)) {
          // :---:
          colAlign[iCol] = ColumnAlignment.Center;
          // Update the lower bound of visual `colWidth` (without padding) based on the column alignment specification
          colWidth[iCol] = Math.max(colWidth[iCol], delimiterRowNoPadding ? 5 - 2 : 5);
          // The length of all `-`, `:` chars in this delimiter cell
          const specWidth = delimiterRowNoPadding ? colWidth[iCol] + 2 : colWidth[iCol];
          return ':' + '-'.repeat(specWidth - 2) + ':';
      } else if (/:-+/.test(cell)) {
          // :---
          colAlign[iCol] = ColumnAlignment.Left;
          colWidth[iCol] = Math.max(colWidth[iCol], delimiterRowNoPadding ? 4 - 2 : 4);
          const specWidth = delimiterRowNoPadding ? colWidth[iCol] + 2 : colWidth[iCol];
          return ':' + '-'.repeat(specWidth - 1);
      } else if (/-+:/.test(cell)) {
          // ---:
          colAlign[iCol] = ColumnAlignment.Right;
          colWidth[iCol] = Math.max(colWidth[iCol], delimiterRowNoPadding ? 4 - 2 : 4);
          const specWidth = delimiterRowNoPadding ? colWidth[iCol] + 2 : colWidth[iCol];
          return '-'.repeat(specWidth - 1) + ':';
      } else {
          // ---
          colAlign[iCol] = ColumnAlignment.None;
          colWidth[iCol] = Math.max(colWidth[iCol], delimiterRowNoPadding ? 3 - 2 : 3);
          const specWidth = delimiterRowNoPadding ? colWidth[iCol] + 2 : colWidth[iCol];
          return '-'.repeat(specWidth);
      }
  });

  return lines.map((row, iRow) => {
      if (iRow === delimiterRowIndex && delimiterRowNoPadding) {
          return indentation + '|' + row.join('|') + '|';
      }

      let cells = row.map((cell, iCol) => {
          const visualWidth = colWidth[iCol];
          let jsLength = splitter.splitGraphemes(cell + ' '.repeat(visualWidth)).slice(0, visualWidth).join('').length;

          const cjkPoints = cell.match(cjkRegex);
          if (cjkPoints) {
              jsLength -= cjkPoints.length;
          }

          return alignText(cell, colAlign[iCol], jsLength);
      });
      return indentation + '| ' + cells.join(' | ') + ' |';
  }).join(eol === EndOfLine.LF ? '\n' : '\r\n');
}

function alignText(text: string, align: ColumnAlignment, length: number) {
  if (align === ColumnAlignment.Center && length > text.length) {
      return (' '.repeat(Math.floor((length - text.length) / 2)) + text + ' '.repeat(length)).slice(0, length);
  } else if (align === ColumnAlignment.Right) {
      return (' '.repeat(length) + text).slice(-length);
  } else {
      return (text + ' '.repeat(length)).slice(0, length);
  }
}
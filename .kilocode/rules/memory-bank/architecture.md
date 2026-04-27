# Architecture

## System Overview

This VS Code extension follows a simple, modular architecture designed for maintainability and clarity.

```
┌─────────────────────────────────────────────────────────┐
│                    VS Code API Layer                     │
│  (extension.ts - Command Registration & UI Interaction) │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   Business Logic Layer                   │
│          (utils.ts - Table Manipulation Functions)       │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                  Formatting Engine Layer                 │
│    (vscode-markdown/utils_extern.ts - formatTable())    │
└─────────────────────────────────────────────────────────┘
```

## Component Architecture

### 1. Extension Layer (`extension.ts`)

**Responsibilities:**
- Extension lifecycle management (`activate`, `deactivate`)
- Command registration with VS Code
- User input collection (showInputBox, showErrorMessage)
- Editor interaction (getText, edit)

**Commands:**
```typescript
markdown-table-structure-based.create        → createTable()
markdown-table-structure-based.concat        → concatNormal()
markdown-table-structure-based.concatReverse → concatReverseFirst()
```

**Flow:**
1. User invokes command via Command Palette (Ctrl+Shift+P)
2. Extension validates active editor and selection
3. Collects additional input if needed (e.g., column count)
4. Calls utility function with selected text
5. Replaces editor selection with result

### 2. Business Logic Layer (`utils.ts`)

**Responsibilities:**
- Parse input text into structured data
- Transform data according to command type
- Handle edge cases (different row counts, empty cells)
- Call formatting engine for final output

**Core Functions:**

#### `create(input: string, columnsNumber: number): string`
- **Purpose:** Convert structured text to Markdown table
- **Input Modes:**
  1. **Column-first:** Columns separated by blank lines
  2. **Row-first:** Each cell on new line, row by row
- **Process:**
  1. Split input by multiple newlines
  2. Detect input mode based on segment count
  3. Build rows array with proper cell ordering
  4. Insert delimiter row with alignment markers
  5. Call `formatTable()` for final formatting

#### `concat(tablesInput: string): string`
- **Purpose:** Merge multiple tables side-by-side
- **Process:**
  1. Split input by multiple newlines into table array
  2. Call `concatenate()` with table array
  3. Return formatted result

#### `concatReverse(tablesInput: string): string`
- **Purpose:** Merge tables in reverse order
- **Process:**
  1. Split input by multiple newlines
  2. Reverse table array
  3. Call `concatenate()`

#### `concatenate(tables: string[]): string`
- **Purpose:** Internal function to merge table arrays
- **Algorithm:**
  1. Parse each table into rows
  2. Count columns in each table
  3. Find maximum row count across all tables
  4. For each row position:
     - Concatenate cells from all tables at that position
     - Fill with empty cells if table has insufficient rows
  5. Call `formatTable()` for final formatting

#### `clean(input: string): string`
- **Purpose:** Test helper to normalize whitespace
- **Process:**
  1. Trim input
  2. Remove leading whitespace from each line
  3. Join lines

#### `numberOfMatches(input: string, matcher: RegExp): number`
- **Purpose:** Count regex matches in string
- **Used for:** Counting pipe characters to determine column count

### 3. Formatting Engine Layer (`vscode-markdown/utils_extern.ts`)

**Responsibilities:**
- Parse Markdown table syntax
- Calculate optimal column widths
- Handle Unicode and CJK character widths
- Apply proper Markdown formatting

**Key Features:**

#### Column Alignment Detection
- `:---` - Left aligned
- `:---:` - Center aligned
- `---:` - Right aligned
- `---` - Default (none)

#### Width Calculation
- Uses `GraphemeSplitter` for accurate character counting
- CJK character detection for double-width characters
- Calculates visual width, not just character count

#### Formatting Process
1. Parse table into rows and cells
2. Detect alignment from delimiter row
3. Calculate desired width for each column
4. Normalize delimiter row according to widths
5. Pad cells to align columns
6. Apply indentation preservation
7. Join with proper line endings

## Data Structures

### Table Representation

```typescript
// Internal table representation: 2D array of strings
cells: string[][]  // [tableIndex][rowIndex] = cellContent

// Column metadata
numberOfColumns: number[]  // Columns per table
colWidth: number[]         // Visual width per column
colAlign: ColumnAlignment[] // Alignment per column
```

### Input Patterns

```typescript
// Multiple newlines separator
const multipleNewLines = /\n\n+/;

// Field extraction (handles escaped pipes)
const fieldRegExp = /((\\\||[^\|])*)\|/gu;

// CJK character detection
const cjkRegex = /[\u3000-\u9fff\uac00-\ud7af\uff01-\uff60]/g;
```

## Component Relationships

```
┌──────────────┐
│  User Input  │
└──────┬───────┘
       │
       ▼
┌─────────────────────────┐
│   extension.ts          │
│  - createTable()        │
│  - concatNormal()       │
│  - concatReverseFirst() │
└───────────┬─────────────┘
            │ calls
            ▼
┌─────────────────────────┐
│   utils.ts              │
│  - create()             │
│  - concat()             │
│  - concatReverse()      │
│  - concatenate()        │
└───────────┬─────────────┘
            │ calls
            ▼
┌─────────────────────────┐
│   utils_extern.ts       │
│  - formatTable()        │
│  - alignText()          │
│  - getTableIndentation()│
└─────────────────────────┘
```

## File Organization

### Source Files

```
src/
├── extension.ts              # Entry point, command handlers
├── utils.ts                  # Core business logic
├── vscode-markdown/
│   └── utils_extern.ts       # Formatting engine (external code)
└── test/
    └── extension.test.ts     # Test suite
```

### Build Output

```
out/
├── extension.js
├── utils.js
└── vscode-markdown/
    └── utils_extern.js
```

## Execution Flow Examples

### Create Table Flow

```
1. User selects text: "Cell1\nCell2\nCell3\nCell4"
2. User runs: Ctrl+Shift+P → "Markdown create table"
3. User enters: 2 (columns)
4. extension.ts:createTable() validates and collects input
5. utils.ts:create() processes:
   - Splits by newlines: ["Cell1", "Cell2", "Cell3", "Cell4"]
   - Builds rows: ["|Cell1|Cell2|", "|Cell3|Cell4|"]
   - Adds delimiter: ["|Cell1|Cell2|", "|:---|:---|", "|Cell3|Cell4|"]
6. utils_extern.ts:formatTable() formats:
   - Calculates widths
   - Pads cells
   - Returns formatted table
7. Editor selection replaced with result
```

### Concatenate Tables Flow

```
1. User selects: "Table1\n\nTable2\n\nTable3"
2. User runs: Ctrl+Shift+P → "Markdown concatenate tables"
3. extension.ts:concatNormal() validates selection
4. utils.ts:concat() processes:
   - Splits by double newlines: [Table1, Table2, Table3]
   - Calls concatenate()
5. utils.ts:concatenate() merges:
   - Parses each table into rows
   - Finds max row count
   - Concatenates cells horizontally
   - Fills missing rows with empty cells
6. utils_extern.ts:formatTable() formats result
7. Editor selection replaced with result
```

## Dependencies Graph

```
extension.ts
    ↓ imports
utils.ts
    ↓ imports
vscode-markdown/utils_extern.ts
    ↓ imports
grapheme-splitter (npm package)
    ↓ imports
vscode (VS Code API)
```

## Extension Points

### Customization Options

Currently, the extension has limited customization:

- **Delimiter row padding:** `delimiterRowNoPadding = false` (hardcoded)
- **Line ending:** Uses `EndOfLine.LF` (Unix-style)
- **Tab size:** Uses editor's tab size setting
- **Insert spaces:** Uses editor's insertSpaces setting

### Potential Extension Points

Future versions could expose:

- Alignment options (currently only left-aligned)
- Custom delimiter patterns
- Empty cell placeholder strings
- Support for `\r\n` line endings
- Table styling options

## Error Handling Strategy

Current approach:

1. **Validation** - Check for active editor and selection
2. **User Feedback** - Show error messages via VS Code UI
3. **Graceful Degradation** - Return early on errors

Example:
```typescript
if (!editor) {
    vscode.window.showErrorMessage('No active text editor.');
    return;
}
```

## Testing Architecture

### Test Organization

```
extension.test.ts
├── Create table tests
│   ├── Column-first format
│   └── Row-first format
├── Format table tests
│   └── 2-column table
├── Clean utility tests
│   ├── Trim first/last newline
│   └── Trim start of each line
├── Concatenate tests
│   ├── 2 tables
│   ├── 2 tables unformatted
│   ├── 4 tables different rows
│   └── 4 tables different ordering
└── Concatenate reverse tests
    └── 4 tables different ordering
```

### Test Utilities

- **clean():** Normalizes whitespace for comparison
- **strictEqual:** Node.js assertion for exact matching
- **Test input preparation:** Uses template literals with clean()

# Technology Stack

## Core Technologies

### Runtime Environment
- **VS Code Extension API** - ^1.86.0
- **Node.js** - 18.x (via @types/node)
- **TypeScript** - ^5.3.3
  - Module: Node16
  - Target: ES2022
  - Strict mode enabled
  - Output: ES2022

### Build & Development
- **Package Manager:** Yarn
- **Build Tool:** TypeScript Compiler (tsc)
- **Linter:** ESLint ^8.56.0 with @typescript-eslint plugins
- **Test Framework:** VS Code Test CLI (@vscode/test-cli ^0.0.4)

### Key Dependencies

#### Production
- **grapheme-splitter** - ^1.0.4
  - Used for proper Unicode character counting
  - Essential for correct table cell width calculation with CJK characters
  - Splits grapheme clusters for accurate visual width measurement

#### Development
- **@types/vscode** - ^1.86.0
- **@types/mocha** - ^10.0.6
- **@types/node** - 18.x
- **@typescript-eslint/eslint-plugin** - ^6.19.1
- **@typescript-eslint/parser** - ^6.19.1
- **@vscode/test-electron** - ^2.3.9
- **@vscode/test-cli** - ^0.0.4
- **eslint** - ^8.56.0

## Project Structure

```
markdown-table-structure-based/
├── src/
│   ├── extension.ts          # Main entry point, command registration
│   ├── utils.ts              # Core table manipulation logic
│   ├── vscode-markdown/
│   │   └── utils_extern.ts   # Table formatting (from vscode-markdown)
│   └── test/
│       └── extension.test.ts # Comprehensive test suite
├── out/                      # Compiled JavaScript output
├── images/                   # Extension icons and documentation images
├── .vscode/                  # VS Code configuration
│   ├── launch.json          # Debug configuration
│   ├── settings.json        # Workspace settings
│   ├── tasks.json           # Build tasks
│   └── extensions.json      # Recommended extensions
├── package.json             # Extension manifest and dependencies
├── tsconfig.json            # TypeScript configuration
├── .eslintrc.json           # ESLint configuration
└── .vscode-test.mjs         # Test configuration
```

## Architecture

### Extension Architecture

The extension follows VS Code's standard extension architecture:

1. **Activation** - Extension activates on language trigger or command invocation
2. **Command Registration** - Three commands registered in `activate()` function
3. **Command Execution** - Each command:
   - Validates active editor exists
   - Gets selected text
   - Calls appropriate utility function
   - Replaces selection with result

### Core Components

#### `extension.ts`
- Entry point for the extension
- Registers three commands:
  - `markdown-table-structure-based.create`
  - `markdown-table-structure-based.concat`
  - `markdown-table-structure-based.concatReverse`
- Manages command lifecycle and user interactions

#### `utils.ts`
- Contains all table manipulation logic:
  - `create()` - Converts structured text to tables
  - `concat()` - Merges multiple tables
  - `concatReverse()` - Merges tables in reverse order
  - `concatenate()` - Internal merge function
  - `clean()` - Test helper for whitespace normalization
  - `numberOfMatches()` - Helper for counting regex matches

#### `vscode-markdown/utils_extern.ts`
- Adapted from [vscode-markdown extension](https://github.com/yzhang-gh/vscode-markdown)
- Provides `formatTable()` function
- Handles:
  - Column alignment detection
  - Cell width calculation (including CJK character support)
  - Proper Markdown table formatting
  - Grapheme-aware text measurement

### Data Flow

```
User Selection → Command → Validation → Utility Function → formatTable() → Editor Replacement
```

## Technical Decisions

### Table Formatting Approach
- Uses proven formatting logic from `vscode-markdown` extension
- Ensures compatibility with standard Markdown table syntax
- Supports CJK character width detection
- Handles grapheme clusters correctly

### Input Parsing Strategy
- Splits input by multiple newlines (`/\n\n+/`) to separate logical units
- Supports two input modes for `create`:
  1. Column-first: Each column is separated by blank lines
  2. Row-first: Each cell is on a new line

### Error Handling
- Validates active editor exists
- Validates user selection is not empty
- Validates numeric input for column count
- Shows informative error messages via VS Code UI

### Testing Strategy
- Uses Node.js `assert` module with `strictEqual`
- Comprehensive test coverage for all functions
- Tests for:
  - Both input formats (row-first, column-first)
  - Table concatenation with varying row counts
  - Reverse concatenation
  - Table formatting
  - Utility functions

## Development Commands

```bash
# Install dependencies
yarn install

# Compile TypeScript
yarn run compile

# Watch mode (auto-compile)
yarn run watch

# Run linter
yarn run lint

# Run tests
yarn run test

# Pre-publish compilation
yarn run vscode:prepublish
```

## Debugging

- Press `F5` in VS Code to launch Extension Development Host
- Debug configuration disables all other extensions
- Source maps enabled for TypeScript debugging
- Output directory: `out/`

## Known Technical Limitations

1. **Line Endings** - Currently only supports `\n`, not `\r\n`
2. **Empty Cells** - No built-in support for intentional empty cells during creation
3. **Alignment** - Only supports left alignment (`:---`), no center or right
4. **Error Management** - Basic error handling, could be more robust

## Performance Considerations

- Table formatting uses Unicode normalization (NFC)
- Grapheme splitting for accurate character counting
- Regex-based parsing for performance
- In-memory string manipulation (suitable for typical table sizes)

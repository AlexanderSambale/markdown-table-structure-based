# Easily create Markdown tables of already structured text

- [Easily create Markdown tables of already structured text](#easily-create-markdown-tables-of-already-structured-text)
  - [Features](#features)
    - [Create a table reading rows first](#create-a-table-reading-rows-first)
    - [Create a table reading columns first](#create-a-table-reading-columns-first)
    - [Concatenate tables](#concatenate-tables)
    - [Concatenate tables in reverse order](#concatenate-tables-in-reverse-order)
  - [Local development](#local-development)
    - [Prerequisites](#prerequisites)
    - [Commands](#commands)
  - [Known Issues](#known-issues)
  - [Contribute](#contribute)

## Features

### Create a table reading rows first

- Select your table data (each new line is one cell in the table corresponding left to right / rows)
- Use `Ctrl+Shift+P` to bring up the **Command Palette**
- Type `Markdown create table` and confirm
- Enter the number of columns, confirm
- You should see your formatted table

![create reading rows first](images/webp/createTableByRows.webp)

### Create a table reading columns first

- Select your table data (each new line is one cell in the table corresponding top to bottom / columns)
- Use `Ctrl+Shift+P` to bring up the **Command Palette**
- Type `Markdown create table` and confirm
- Enter the number of columns, confirm
- You should see your formatted table

![create reading columns first](images/webp/createTableByColumns.webp)

### Concatenate tables

- Select your tables separated by LineFeeds
- Use `Ctrl+Shift+P` to bring up the **Command Palette**
- Type `Markdown concatenate tables` and confirm
- You should see your tables merged into one.

![concatenate tables](images/webp/concatTables.webp)

### Concatenate tables in reverse order

- Select your tables separated by LineFeeds
- Use `Ctrl+Shift+P` to bring up the **Command Palette**
- Type `Markdown concatenate tables in reverse order` and confirm
- You should see your tables merged into one, but in reversed order.

![concatenate tables in reverse order](images/webp/concatTablesReverse.webp)

## Local development

### Prerequisites

- `yarn`
- `vscode`

### Commands

Install needed packages

```bash
yarn install
```

Run tests

```bash
yarn run test
```

Press `F5` to open a new window with the extension loaded and all others disabled.

## Known Issues

- Error management could be improved.
- If you want empty table cells during `create` table, you should use a special string and replace it afterwards.
- Only `:---` is supported at the moment
- Linefeed is `\n` at the moment, no `\r\n` support.

## Contribute

Have a look at [Known Issues](#known-issues) or raise your own.
This is my first public open source project, so I appreciate hints and help!

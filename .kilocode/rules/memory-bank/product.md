# Product Description

## Problem Statement

When working with structured text data (like recipe ingredients, specifications, or any tabular data), converting it into properly formatted Markdown tables requires significant manual effort. Users must:

- Manually add pipe characters (`|`) between cells
- Ensure proper alignment and spacing
- Create delimiter rows with correct syntax
- Handle edge cases like empty cells or varying row counts

This manual process is time-consuming and error-prone, especially for large tables or when merging multiple tables.

## Solution

This extension provides three automated commands to handle common table manipulation scenarios:

### 1. Create Table from Structured Text

**Use Case:** User has text data that follows a pattern and wants to convert it to a Markdown table.

**How it works:**
- User selects the structured text
- Runs the `Markdown create table` command
- Enters the number of columns
- Extension automatically formats the text into a proper Markdown table

**Two input formats supported:**
- **Row-first:** Each line is a cell, filled left-to-right, top-to-bottom
- **Column-first:** Each line is a complete column, filled top-to-bottom

**Example:**
```
Input (column-first, 2 columns):
Zutaten
Menge
Haferflocken
2 Esslöffel / 15 g
Wasser
0.4 Liter / 400 g

Output:
| Zutaten      | Menge              |
| :----------- | :----------------- |
| Haferflocken | 2 Esslöffel / 15 g |
| Wasser       | 0.4 Liter / 400 g  |
```

### 2. Concatenate Tables

**Use Case:** User has multiple separate tables and wants to merge them side-by-side into one larger table.

**How it works:**
- User selects multiple tables separated by blank lines
- Runs the `Markdown concatenate tables` command
- Extension merges all tables horizontally, adding their columns

**Example:**
```
Input (2 tables):
| Zutaten | Menge |
| :------ | :---- |
| Mehl    | 200g  |

| Nährwerte | Menge |
| :-------- | :---- |
| Kalorien  | 300   |

Output:
| Zutaten | Menge | Nährwerte | Menge |
| :------ | :---- | :-------- | :---- |
| Mehl    | 200g  | Kalorien  | 300   |
```

### 3. Concatenate Tables in Reverse Order

**Use Case:** Same as concatenate, but user wants tables in reverse order (last table becomes first).

**How it works:**
- Same as concatenate, but reverses the table array before merging

## User Experience Goals

1. **Simplicity** - Minimal user input required (just selection and column count for create)
2. **Speed** - Instant transformation with single command
3. **Reliability** - Consistent formatting every time
4. **Flexibility** - Support for different input formats and table structures
5. **Integration** - Works seamlessly within VS Code's existing workflow

## Activation Conditions

The extension activates when:
- Opening files with language: `markdown`, `mdx`, `rmd`, or `quarto`
- User invokes one of the three commands via Command Palette

## Success Metrics

- Tables are properly formatted with correct Markdown syntax
- User can create tables in seconds instead of minutes
- Multiple tables can be merged without manual reformatting
- Extension handles edge cases (different row counts, empty cells) gracefully

# Project Brief

## Project Overview

**Name:** Markdown Table structure based  
**Type:** VS Code Extension  
**Version:** 0.3.1  
**Publisher:** samxela (Alexander Sambale)  
**Repository:** https://github.com/AlexanderSambale/markdown-table-structure-based

## Purpose

This VS Code extension automates the creation and manipulation of Markdown tables from structured text. It eliminates the manual work required when copying tables into Markdown format by providing automated table formatting and concatenation features.

## Core Features

1. **Create Table** - Convert structured text into formatted Markdown tables
   - Supports reading rows first (each newline is a cell, left to right)
   - Supports reading columns first (each newline is a column, top to bottom)
   - User specifies number of columns via input box

2. **Concatenate Tables** - Merge multiple Markdown tables into one
   - Combines tables side-by-side (adds columns)
   - Handles tables with different numbers of rows
   - Automatically formats the merged table

3. **Concatenate Tables Reverse** - Same as concatenate but reverses table order

## Target Users

- Users working with Markdown documentation
- Users who need to convert structured data into table format
- Users working with recipe data, specifications, or similar structured information

## Technical Foundation

- Built with TypeScript
- Uses VS Code Extension API
- Leverages table formatting logic from the popular `vscode-markdown` extension
- Supports Markdown, MDX, RMarkdown, and Quarto file types

## Key Dependencies

- `grapheme-splitter` - For proper Unicode character handling in table cells
- VS Code API (^1.86.0)
- TypeScript ^5.3.3
- ESLint for code quality

## Development Status

- Active development with regular updates
- Latest version: 0.3.1 (February 2024)
- Comprehensive test suite included
- Published on VS Code Marketplace

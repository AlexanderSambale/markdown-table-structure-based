import { strictEqual } from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import { clean, concat, create } from '../utils';
import { formatTable } from '../vscode-markdown/utils_extern';
// import * as myExtension from '../../extension';

suite('Extension Test Suite', () => {
	test('Create table where columns are already structured by newline with 4 columns', () => {
		const input = clean(`
		Arbeitszeit
		12 Min.
		
		Fertig in
		12 Min.
		
		Kalorien
		53
		
		Level
		Einfach
		`);
		const expected = clean(`
		| Arbeitszeit | Fertig in | Kalorien | Level   |
		|:------------|:----------|:---------|:--------|
		| 12 Min.     | 12 Min.   | 53       | Einfach |
		`);
		strictEqual(create(input, 4), expected);
	});

	test('Create table where each cell is on a newline with 2 columns', () => {
		const input = clean(`
		Zutaten
		Menge
		Haferflocken
		2 Esslöffel / 15 g
		Wasser
		0.4 Liter / 400 g
		Salz
		1 Prise/n / 1 g
		`);
		const expected = clean(`
		| Zutaten      | Menge              |
		|:-------------|:-------------------|
		| Haferflocken | 2 Esslöffel / 15 g |
		| Wasser       | 0.4 Liter / 400 g  |
		| Salz         | 1 Prise/n / 1 g    |
		`);
		strictEqual(create(input, 2), expected);
	});

	test('Format table with 2 columns', () => {
		const input = clean(`
		|Zutaten| Menge|
		| :-- | :-- |
		|Haferflocken| 2 Esslöffel / 15 g|
		|Wasser|0.4 Liter / 400 g|
		|Salz|1 Prise/n / 1 g|
		`);
		const expected = clean(`
		| Zutaten      | Menge              |
		|:-------------|:-------------------|
		| Haferflocken | 2 Esslöffel / 15 g |
		| Wasser       | 0.4 Liter / 400 g  |
		| Salz         | 1 Prise/n / 1 g    |
		`);
		strictEqual(formatTable(input), expected);
	});

	test('Remove white spaces for tests, first and last newline', () => {
		const input = `
		test
		`;
		const expected = 'test';
		strictEqual(clean(input), expected);
	});

	test('Remove white spaces for tests, trim start for every newline', () => {
		const input = `
		Arbeitszeit
		12 Min.
		
		Fertig in
		12 Min.
		
		Kalorien
		53
		
		Level
		Einfach
		`;
		const expected = 'Arbeitszeit\n12 Min.\n\nFertig in\n12 Min.\n\nKalorien\n53\n\nLevel\nEinfach';
		strictEqual(clean(input), expected);
	});

	test('Concat 2 tables', () => {
		const input = clean(`
		| Zutaten      | Menge              |
		|:-------------|:-------------------|
		| Haferflocken | 2 Esslöffel / 15 g |
		| Wasser       | 0.4 Liter / 400 g  |
		| Salz         | 1 Prise/n / 1 g    |

		| Z      | M              |
		|:-------------|:-------------------|
		| H | 2  |
		| W       | 0.4   |
		| S         | 1  |		
		`);
		const expected = clean(`
		| Zutaten      | Menge              | Z      | M              |
		|:-------------|:-------------------|:-------------|:-------------------|
		| Haferflocken | 2 Esslöffel / 15 g | H | 2  |
		| Wasser       | 0.4 Liter / 400 g  | W       | 0.4   |
		| Salz         | 1 Prise/n / 1 g    | S         | 1  |
		`);
		strictEqual(concat(input), expected);
	});
});
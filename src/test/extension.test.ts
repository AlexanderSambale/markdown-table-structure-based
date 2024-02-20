import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { create } from '../utils';
// import * as myExtension from '../../extension';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Create table with 4 columns', () => {
		const input = `Arbeitszeit
		12 Min.
		
		Fertig in
		12 Min.
		
		Kalorien
		53
		
		Level
		Einfach`;
		const expected = `|Arbeitszeit |Fertig in |Kalorien|Level|
		| :-- | :-- | :-- | :-- |
		|12 Min. |12 Min. |53|Einfach`;
		assert.strictEqual(create(input, 4), expected);
	});

	test('Create table with 2 columns', () => {
		const input = `Zutaten
		Menge
		Haferflocken
		2 Esslöffel / 15 g
		Wasser
		0.4 Liter / 400 g
		Salz
		1 Prise/n / 1 g`;
		const expected = `|Zutaten| Menge|
		| :-- | :-- |
		|Haferflocken| 2 Esslöffel / 15 g|
		|Wasser|0.4 Liter / 400 g|
		|Salz|1 Prise/n / 1 g|`;
		assert.strictEqual(create(input, 2), expected);
	});
});
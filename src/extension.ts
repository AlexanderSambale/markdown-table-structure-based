// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { create } from './utils';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	let create = vscode.commands.registerCommand('markdown-table-structure-based.create', createTable);

	let concat = vscode.commands.registerCommand('markdown-table-structure-based.concat', concatNormal);
	});

	context.subscriptions.push(create, concat);
}

// This method is called when your extension is deactivated
export function deactivate() {}

async function createTable() {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showErrorMessage('No active text editor.');
		return;
	}

	const selection = editor.selection;
	const selectedText = editor.document.getText(selection);

	// Check if there's a selection
	if (selection.isEmpty) {
		vscode.window.showInformationMessage('Please select text to replace.');
		return;
	} 

	// get number of columns by user
	const userNumber = await vscode.window.showInputBox({
		prompt: 'How many columns has the table?',
		validateInput: (value) => {
			const parsedValue = parseInt(value);
			return isNaN(parsedValue) ? 'Please enter a valid number' : undefined;
		}
	});

	if (userNumber === undefined) {
		// User canceled the input
		return;
	}

	const numberOfColumns = parseInt(userNumber);

	editor.edit((editBuilder) => {
		editBuilder.replace(selection, create(selectedText, numberOfColumns));
	});
}

function concatNormal() {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showErrorMessage('No active text editor.');
		return;
	}

	const selection = editor.selection;
	const selectedText = editor.document.getText(selection);

	// Check if there's a selection
	if (selection.isEmpty) {
		vscode.window.showInformationMessage('Please select text to replace.');
		return;
	} 

	editor.edit((editBuilder) => {
		editBuilder.replace(selection, concat(selectedText));
	});
}
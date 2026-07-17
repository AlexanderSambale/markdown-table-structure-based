import { InputBox, Workbench, VSBrowser, EditorView, Key, before, beforeEach, EditorTab } from 'vscode-extension-tester';

describe('markdown-table-structure-based', () => {

  let workbench: Workbench;
  let input: InputBox; 
  let editor: EditorTab | undefined;

	before(async () => {
    workbench = new Workbench();
    await workbench.executeCommand('Create new File');
    input = await InputBox.create();
    await input.confirm();

    // Set language to Markdown (optional if you're saving as .md later)
    await workbench.executeCommand('Change Language Mode');
    input = await InputBox.create();
    await input.setText('Markdown');
    await input.confirm();
    const editorView = new EditorView();    
    editor = await editorView.getActiveTab();
	});

  beforeEach(async () => {
    editor?.clear();
	});

	it('Create Table with 4 columns (newline cells with newlines)', async () => {
    await editor?.sendKeys("\nArbeitszeit\n12 Min.\n\nFertig in\n12 Min.\n\nKalorien\n53\n\nLevel\nEinfach");
    await editor?.sendKeys(Key.chord(Key.CONTROL, 'a'));
    await VSBrowser.instance.takeScreenshot("createTableByRows_1")
    await workbench.openCommandPrompt();
    const cmd = await InputBox.create();
    await cmd.setText('>Markdown: create table');
    await VSBrowser.instance.takeScreenshot("createTableByRows_2")
    await cmd.confirm();
    const cols = await InputBox.create();
    await cols.setText('4');
    await VSBrowser.instance.takeScreenshot("createTableByRows_3")
    await cols.confirm();
    await VSBrowser.instance.takeScreenshot("createTableByRows_4")
	});

	it('Create Table with 2 columns (newline cells)', async () => {
    await editor?.sendKeys("\nZutaten\nMenge\nHaferflocken\n2 Esslöffel / 15 g\nWasser\n0.4 Liter / 400 g\nSalz\n1 Prise/n / 1 g");
    await editor?.sendKeys(Key.chord(Key.CONTROL, 'a'));
    await VSBrowser.instance.takeScreenshot("createTableByRows_1")
    await workbench.openCommandPrompt();
    const cmd = await InputBox.create();
    await cmd.setText('>Markdown: create table');
    await VSBrowser.instance.takeScreenshot("createTableByRows_2")
    await cmd.confirm();
    const cols = await InputBox.create();
    await cols.setText('2');
    await VSBrowser.instance.takeScreenshot("createTableByRows_3")
    await cols.confirm();
    await VSBrowser.instance.takeScreenshot("createTableByRows_4")
	});

	it('Concat Tables with different row counts', async () => {
    await editor?.sendKeys("\n| Zutaten      | Menge              |\n| :----------- | :----------------- |\n| Haferflocken | 2 Esslöffel / 15 g |\n| Wasser       | 0.4 Liter / 400 g  |\n| Salz         | 1 Prise/n / 1 g    |\n\n| Z   | M   |\n| :-- | :-- |\n| H   | 2   |\n\n\n| Zutaten      | Menge              |\n| :----------- | :----------------- |\n| Haferflocken | 2 Esslöffel / 15 g |\n| Wasser       | 0.4 Liter / 400 g  |\n\n\n| Z   | M   |\n| :-- | :-- |\n| H   | 2   |\n| W   | 0.4 |\n| S   | 1   |");
    await editor?.sendKeys(Key.chord(Key.CONTROL, 'a'));
    await VSBrowser.instance.takeScreenshot("concatTables_1")
    await workbench.openCommandPrompt();
    const cmd = await InputBox.create();
    await cmd.setText('>Markdown: concat tables');
    await VSBrowser.instance.takeScreenshot("concatTables_2")
    await cmd.confirm();
    await VSBrowser.instance.takeScreenshot("concatTables_3")
	});

	it('Concat Reverse Tables', async () => {
    await editor?.sendKeys("\n| Z   | M   |\n| :-- | :-- |\n| H   | 2   |\n| W   | 0.4 |\n| S   | 1   |\n| S   | 1   |\n| S   | 1   |\n\n| Zutaten      | Menge              |\n| :----------- | :----------------- |\n| Haferflocken | 2 Esslöffel / 15 g |\n| Wasser       | 0.4 Liter / 400 g  |\n| Salz         | 1 Prise/n / 1 g    |\n\n| Z   | M   |\n| :-- | :-- |\n| H   | 2   |\n\n\n| Zutaten      | Menge              |\n| :----------- | :----------------- |\n| Haferflocken | 2 Esslöffel / 15 g |\n| Wasser       | 0.4 Liter / 400 g  |");
    await editor?.sendKeys(Key.chord(Key.CONTROL, 'a'));
    await VSBrowser.instance.takeScreenshot("concatTablesReverse_1")
    await workbench.openCommandPrompt();
    const cmd = await InputBox.create();
    await cmd.setText('>Markdown: concat reverse tables');
    await VSBrowser.instance.takeScreenshot("concatTablesReverse_2")
    await cmd.confirm();
    await VSBrowser.instance.takeScreenshot("concatTablesReverse_3")
	});

	it('Transpose Table', async () => {
    await editor?.sendKeys("\n| Arbeitszeit | Fertig in | Kalorien | Level   |\n| :---------- | :-------- | :------- | :------ |\n| 12 Min.     | 12 Min.   | 53       | Einfach |");
    await editor?.sendKeys(Key.chord(Key.CONTROL, 'a'));
    await VSBrowser.instance.takeScreenshot("transposeTable_1")
    await workbench.openCommandPrompt();
    const cmd = await InputBox.create();
    await cmd.setText('>Markdown: transpose table');
    await VSBrowser.instance.takeScreenshot("transposeTable_2")
    await cmd.confirm();
    await VSBrowser.instance.takeScreenshot("transposeTable_3")
	});

	it('To Lines from Table', async () => {
    await editor?.sendKeys("\n| Zutaten      | Menge              |\n| :----------- | :----------------- |\n| Haferflocken | 2 Esslöffel / 15 g |\n| Wasser       | 0.4 Liter / 400 g  |\n| Salz         | 1 Prise/n / 1 g    |");
    await editor?.sendKeys(Key.chord(Key.CONTROL, 'a'));
    await VSBrowser.instance.takeScreenshot("toLines_1")
    await workbench.openCommandPrompt();
    const cmd = await InputBox.create();
    await cmd.setText('>Markdown: to lines');
    await VSBrowser.instance.takeScreenshot("toLines_2")
    await cmd.confirm();
    await VSBrowser.instance.takeScreenshot("toLines_3")
	});

	it('To Columns from Table', async () => {
    await editor?.sendKeys("\n| Zutaten      | Menge              |\n| :----------- | :----------------- |\n| Haferflocken | 2 Esslöffel / 15 g |\n| Wasser       | 0.4 Liter / 400 g  |\n| Salz         | 1 Prise/n / 1 g    |");
    await editor?.sendKeys(Key.chord(Key.CONTROL, 'a'));
    await VSBrowser.instance.takeScreenshot("toColumns_1")
    await workbench.openCommandPrompt();
    const cmd = await InputBox.create();
    await cmd.setText('>Markdown: to columns');
    await VSBrowser.instance.takeScreenshot("toColumns_2")
    await cmd.confirm();
    await VSBrowser.instance.takeScreenshot("toColumns_3")
	});
});

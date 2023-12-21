const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

function nextEmptySpace() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  const line = editor.document.lineAt(editor.selection.active.line);
  const text = line.text;
  const startIndex = editor.selection.active.character + 1;
  let index = text.indexOf(' ', startIndex);
  
  if(text.charAt(startIndex) === ' ' && text.charAt(index) === ' ') {
    const lineLength = line.text.length;
    while(text.charAt(index) === ' ' && index < (lineLength - 1)) {
      ++index;
    }
  }
  
  if (index === -1) {
    editor.selection = new vscode.Selection(
        editor.selection.active.line, line.range.end.character,
        editor.selection.active.line, line.range.end.character);
  } else {
    editor.selection = new vscode.Selection(
        editor.selection.active.line, index, editor.selection.active.line,
        index);
  }
  editor.revealRange(new vscode.Range(line.range.end, line.range.end));
}

function selectToNextEmptySpace() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;  // No open text editor
  }
  const document = editor.document;
  const selection = editor.selection;

  const line = document.lineAt(editor.selection.active.line);
  const text = line.text;
  const lineNumber = selection.active.line;

  let startIndex = selection.start.character;
  let endIndex = text.indexOf(' ', selection.active.character + 1);
  if (!selection.isEmpty) {
    const cursorIndex = selection.active.character;
    const endSelectionIndex = selection.end.character;
    if (cursorIndex < endSelectionIndex) {
      startIndex = selection.end.character;
    } else {
    }
  }

  if (endIndex === -1) {
    endIndex = text.length;
  }

  const startPos = new vscode.Position(lineNumber, startIndex);
  const endPos = new vscode.Position(lineNumber, endIndex);

  const newSelection = new vscode.Selection(startPos, endPos);
  editor.selection = newSelection;

  editor.revealRange(new vscode.Range(endPos, endPos));
}

function previousEmptySpace() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;  // No open text editor
  }

  const line = editor.document.lineAt(editor.selection.active.line);
  const text = line.text;
  const cursorIndex = editor.selection.active.character - 2;
  let index = text.lastIndexOf(' ', cursorIndex);

  if (index === -1) {
    editor.selection = new vscode.Selection(
        editor.selection.active.line, line.range.start.character,
        editor.selection.active.line, line.range.start.character);
  } else {
    index += 1;
    if (text[index] !== ' ') {
      editor.selection = new vscode.Selection(
          editor.selection.active.line, index, editor.selection.active.line,
          index);
    }
  }
  editor.revealRange(new vscode.Range(line.range.start, line.range.start));
}

function selectToPreviousEmptySpace() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;  // No open text editor
  }
  const document = editor.document;

  const line = document.lineAt(editor.selection.active.line);
  const text = line.text;
  const selection = editor.selection;
  const lineNumber = selection.active.line;

  let startIndex = selection.end.character;
  let endIndex = text.lastIndexOf(' ', editor.selection.active.character - 1);
  if (!selection.isEmpty) {
    const cursorIndex = selection.active.character;
    const startSelectionIndex = selection.start.character;
    if (cursorIndex > startSelectionIndex) {
      startIndex = selection.start.character;
    } else {
    }
  }

  if (endIndex === -1) {
    endIndex = 0;
  }

  const startPos = new vscode.Position(lineNumber, startIndex);
  const endPos = new vscode.Position(lineNumber, endIndex);

  const newSelection = new vscode.Selection(startPos, endPos);
  editor.selection = newSelection;
  
  editor.revealRange(new vscode.Range(endPos, endPos));
}

function lineEnd() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;  // No open text editor
  }
  
  const line = editor.document.lineAt(editor.selection.active.line);
  editor.selection = new vscode.Selection(
      editor.selection.active.line, line.range.end.character,
      editor.selection.active.line, line.range.end.character);
  editor.revealRange(new vscode.Range(line.range.end, line.range.end));
}

function selectToEnd() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;  // No open text editor
  }
  const document = editor.document;
  const selection = editor.selection;
  
  const line = document.lineAt(editor.selection.active.line);
  const text = line.text;
  const lineNumber = selection.active.line;
  
  let startIndex = selection.start.character;
  let endIndex = text.length;
  
  const startPos = new vscode.Position(lineNumber, startIndex);
  const endPos = new vscode.Position(lineNumber, endIndex);
  
  const newSelection = new vscode.Selection(startPos, endPos);
  editor.selection = newSelection;
  
  editor.revealRange(new vscode.Range(endPos, endPos));
}

function selectToStart() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;  // No open text editor
  }
  const selection = editor.selection;
  
  const lineNumber = selection.active.line;
  
  let startIndex = selection.start.character;
  let endIndex = 0;
  
  const startPos = new vscode.Position(lineNumber, startIndex);
  const endPos = new vscode.Position(lineNumber, endIndex);
  
  const newSelection = new vscode.Selection(startPos, endPos);
  editor.selection = newSelection;
  editor.revealRange(new vscode.Range(endPos, endPos));
}


function lineStart() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;  // No open text editor
  }

  const line = editor.document.lineAt(editor.selection.active.line);
  const text = line.text;

  let start = line.range.start.character;
  let end = line.range.end.character;
  while (start < end) {
    let char = text[start++];
    if (char !== ' ') {
      break;
    }
  }
  start -= 1;
  editor.selection = new vscode.Selection(
      editor.selection.active.line, start, editor.selection.active.line, start);
  editor.revealRange(new vscode.Range(line.range.start, line.range.start));
}

function createCppFiles() {
  vscode.window.showInputBox({prompt: 'Enter Filename:'}).then((filename) => {
    try {
      const config = vscode.workspace.getConfiguration('go-to-next-space');
      let folderPath = '';
      if (config.has('folderPath')) {
        folderPath = config.get('folderPath', './');
      } else {
        const defaultFolderPath = './';
        config.update('folderPath', defaultFolderPath, true);
        folderPath = defaultFolderPath;
      }
      const workspaceFolder = vscode.workspace.workspaceFolders[0].uri.fsPath;
      folderPath = path.join(workspaceFolder, folderPath);
      const filePath = path.join(folderPath, filename);
      const headerPath = filePath + '.h';
      const sourcePath = filePath + '.cpp';

      fs.writeFileSync(
          headerPath,
          `#if !defined(${filename.toUpperCase()}_H)\n\n#define ${
              filename.toUpperCase()}_H\n#endif // ${
              filename.toUpperCase()}_H`);
      fs.writeFileSync(
          sourcePath,
          `#include "${filename}.h"\n\n// content of ${
              filename}.cpp goes here\n`);
    } catch (error) {
      vscode.window.showErrorMessage(
          `Error(create cpp file): ${error.message}`);
    }
  });
}

let markStart = null;
function markCursor() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;

  markStart = editor.selection.active;
  vscode.window.showInformationMessage('Mark Set.');
}

function selectMarked() {
  const editor = vscode.window.activeTextEditor;
  if (!editor || !markStart) {
    vscode.window.showErrorMessage('Mark not set.');
    return;
  }

  const end = editor.selection.active;
  const startOffset = editor.document.offsetAt(markStart);
  const endOffset = editor.document.offsetAt(end);

  const selection = new vscode.Selection(
      editor.document.positionAt(Math.min(startOffset, endOffset)),
      editor.document.positionAt(Math.max(startOffset, endOffset)));

  editor.selection = selection;

  markStart = null;
}

async function goToFunctionStart() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;  // no open editor
  }
  const document = editor.document;
  const position = editor.selection.active;

  // Get the language identifier of the current file
  const languageId = document.languageId;

  // If the current file is C or C++, search for the start of the current
  // function
  if (languageId === 'c' || languageId === 'cpp') {
    // Get the symbol information from the language server
    vscode.commands
        .executeCommand('vscode.executeDocumentSymbolProvider', document.uri)
        .then(symbols => {
          let functionSymbol = null;
          for (let i = 0; i < symbols.length; i++) {
            if (symbols[i].kind === vscode.SymbolKind.Function &&
                symbols[i].range.contains(position)) {
              functionSymbol = symbols[i];
              break;
            }
          }
          if (functionSymbol) {
            let funcArgsLine = functionSymbol.range.start.line;
            let lineText = document.lineAt(funcArgsLine).text;

            while (!lineText.includes('{')) {
              ++funcArgsLine;
              lineText = document.lineAt(funcArgsLine).text;
            }

            const openingBraceIndex = lineText.indexOf('{');
            const position =
                new vscode.Position(funcArgsLine, openingBraceIndex + 1);

            editor.selection = new vscode.Selection(position, position);
            
            const revealPos =
                new vscode.Position(functionSymbol.range.start.line, 0);
            editor.revealRange(new vscode.Range(revealPos, revealPos));
          } else {
            vscode.window.showInformationMessage(
                'No function found at current position');
          }
        });
  }
}

async function openFile(filePath, viewColumn) {
  try {
    const document = await vscode.workspace.openTextDocument(filePath);
    vscode.window.showTextDocument(document, viewColumn);
  }
  catch {
    console.error(`Open File Error: ${error}`);
  }
}

async function openHeaderSourceFileInNextEditorGroup() {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return;
  }
  
  const activeDocument = activeEditor.document;
  const activeFilePath = activeDocument.uri.fsPath;
  const activeFileName = activeDocument.fileName;
  
  // Determine the header/source file path based on the current file's name and
  // path
  let headerSourceFilePath;
  if (activeFileName.endsWith('.cpp')) {
    headerSourceFilePath = activeFilePath.replace(/\.cpp$/, '.h');
  } else if (activeFileName.endsWith('.h')) {
    headerSourceFilePath = activeFilePath.replace(/\.h$/, '.cpp');
  } else {
    return;
  }
  
  // Find the header/source file document in the workspace
  // const headerSourceDocument = vscode.workspace.textDocuments.find(
  //     (doc) => doc.uri.fsPath === headerSourceFilePath);
  // if (!headerSourceDocument) {
  //   return;
  // }
  
  // deciding the viewColumn depending on the current active editor.
  let viewColumn = activeEditor.viewColumn;
  if(viewColumn === vscode.ViewColumn.One) {
    viewColumn = vscode.ViewColumn.Two;
  } else if (viewColumn === vscode.ViewColumn.Two) {
    viewColumn = vscode.ViewColumn.One;
  }
  
  // Open the header/source file in the next editor group
  const document = await vscode.workspace.openTextDocument(headerSourceFilePath);
  vscode.window.showTextDocument(document, {
    viewColumn: viewColumn,
    preserveFocus: false,
    preview: false,
  });
}

async function splitToOtherWindow() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;  // No open text editor
  }
  
  const document = editor.document;
  const uri = document.uri;
  const cursorPosition = editor.selection.active;
  
  let activatedEditor;
  
  if (vscode.window.visibleTextEditors.length === 1) {
    // If only one editor is opened, open the current file on the right pane
    activatedEditor = await vscode.commands.executeCommand('workbench.action.splitEditorRight');
  } else {
    // If two editors are opened side by side, duplicate the editor in the other
    // split window
    await vscode.commands.executeCommand('workbench.action.focusNextGroup');
    activatedEditor = vscode.window.activeTextEditor;
  }
  
  if (activatedEditor) {
    const newDocument = await vscode.workspace.openTextDocument(uri);
    await vscode.window.showTextDocument(newDocument, {
      viewColumn: activatedEditor.viewColumn,
      selection: new vscode.Selection(cursorPosition, cursorPosition)
    }).then(() => {
      vscode.window.showTextDocument(document, {
        viewColumn: editor.viewColumn
      });
    });
  }
}

// function isLineComment(line) {
//   const editor = vscode.window.activeTextEditor;
//   if (editor) {
//     const languageId = editor.document.languageId;
//     const commentMarkers = vscode.languages.getLanguage(languageId)
//                                .configuration.comments.lineComment;
//     if (commentMarkers) {
//       const lineText = line.text.trim();
//       for (const commentMarker of commentMarkers) {
//         if (lineText.startsWith(commentMarker)) {
//           return true;
//         }
//       }
//     }
//   }
//   return false;
// }

function addSemicolonAndMoveCursor() {
  return;
  const editor = vscode.window.activeTextEditor;
  
  if(editor) {
    const cursorPosition = editor.selection.active;
    const line = editor.document.lineAt(cursorPosition.line);
    const lineText = line.text;
    
    if (!lineText.endsWith(';')) {
      const endOfLinePosition =
          new vscode.Position(cursorPosition.line, lineText.length);
      editor
          .edit((editBuilder) => {
            editBuilder.insert(endOfLinePosition, ';');
          })
          .then(() => {
            let pos = endOfLinePosition.translate(0, 1);
            editor.selection = new vscode.Selection(pos, pos);
          });
    } else {
      const position = editor.selection.active;
      editor.edit(editBuilder => {
        editBuilder.insert(position, ';');
      });
    }
  }
}

function activate(context) {
  let nextSpaceCommand = vscode.commands.registerCommand(
      'go-to-next-space.goToNextSpace', nextEmptySpace);
  let selectToNextSpaceCommand = vscode.commands.registerCommand(
      'go-to-next-space.selectToNextSpace', selectToNextEmptySpace);
  
  let previousSpaceCommand = vscode.commands.registerCommand(
      'go-to-next-space.goToPreviousSpace', previousEmptySpace);
  let selectToPreviousSpaceCommand = vscode.commands.registerCommand(
      'go-to-next-space.selectToPreviousSpace', selectToPreviousEmptySpace);
  
  let lineEndCommand =
      vscode.commands.registerCommand('go-to-next-space.goToLineEnd', lineEnd);
  let selectToEndCommand = vscode.commands.registerCommand(
      'go-to-next-space.selectToEnd', selectToEnd);
  let lineStartCommand = vscode.commands.registerCommand(
      'go-to-next-space.goToLineStart', lineStart);
  let selectToStartCommand = vscode.commands.registerCommand(
      'go-to-next-space.selectToStart', selectToStart);
  
  let createCppFilesCommand = vscode.commands.registerCommand(
      'go-to-next-space.createCppFiles', createCppFiles);
  
  let markCursorCommand = vscode.commands.registerCommand(
      'go-to-next-space.markCursor', markCursor);
  let selectMarkedCommand = vscode.commands.registerCommand(
      'go-to-next-space.selectMarked', selectMarked);
  
  let goToFunctionStartCommand = vscode.commands.registerCommand(
      'go-to-next-space.goToFunctionStart', goToFunctionStart);
  
  let splitCommand = vscode.commands.registerCommand(
      'go-to-next-space.split', splitToOtherWindow);
  
  let addSemicolonCommand = vscode.commands.registerCommand(
      'go-to-next-space.addSemicolonAndMoveCursor', addSemicolonAndMoveCursor);

  let toggleHeaderInOtherWindowCommand = vscode.commands.registerCommand(
      'go-to-next-space.toggleHeaderInOtherWindow',
      openHeaderSourceFileInNextEditorGroup);

  context.subscriptions.push(addSemicolonCommand);
  context.subscriptions.push(nextSpaceCommand);
  context.subscriptions.push(selectToNextSpaceCommand);
  context.subscriptions.push(previousSpaceCommand);
  context.subscriptions.push(selectToPreviousSpaceCommand);
  context.subscriptions.push(lineEndCommand);
  context.subscriptions.push(selectToEndCommand);
  context.subscriptions.push(lineStartCommand);
  context.subscriptions.push(selectToStartCommand);
  context.subscriptions.push(createCppFilesCommand);
  context.subscriptions.push(markCursorCommand);
  context.subscriptions.push(selectMarkedCommand);
  context.subscriptions.push(goToFunctionStartCommand);
  context.subscriptions.push(splitCommand);
  context.subscriptions.push(toggleHeaderInOtherWindowCommand);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
}

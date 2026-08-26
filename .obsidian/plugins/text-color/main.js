'use strict';

const { Plugin, FuzzySuggestModal, Notice } = require('obsidian');

const COLORS = [
  { key: 'red',    label: 'Red' },
  { key: 'orange', label: 'Orange' },
  { key: 'yellow', label: 'Yellow' },
  { key: 'green',  label: 'Green' },
  { key: 'cyan',   label: 'Cyan' },
  { key: 'blue',   label: 'Blue' },
  { key: 'purple', label: 'Purple' },
  { key: 'pink',   label: 'Pink' },
  { key: 'muted',  label: 'Muted grey' },
  { key: 'accent', label: 'Accent' },
];

const WORD = /[\w'’-]/;

/* If nothing is selected, select the word under the cursor so the command
   still does something useful. Returns the selected text (possibly ''). */
function selectWordIfEmpty(editor) {
  const sel = editor.getSelection();
  if (sel) return sel;

  const cur = editor.getCursor();
  const line = editor.getLine(cur.line);
  let start = cur.ch;
  let end = cur.ch;
  while (start > 0 && WORD.test(line[start - 1])) start--;
  while (end < line.length && WORD.test(line[end])) end++;
  if (start === end) return '';

  editor.setSelection({ line: cur.line, ch: start }, { line: cur.line, ch: end });
  return editor.getSelection();
}

function stripColorSpans(text) {
  return text.replace(/<span class="tc-[a-z-]+">([\s\S]*?)<\/span>/g, '$1');
}

function applyClass(editor, cls) {
  const sel = selectWordIfEmpty(editor);
  if (!sel) {
    new Notice('Select some text first');
    return;
  }
  const inner = stripColorSpans(sel);
  const wrapped = `<span class="${cls}">${inner}</span>`;
  editor.replaceSelection(wrapped);

  // Leave the newly wrapped text selected so colors can be swapped freely.
  const to = editor.getCursor();
  const from = { line: to.line, ch: to.ch - wrapped.length };
  if (from.ch >= 0) editor.setSelection(from, to);
}

class ColorSuggest extends FuzzySuggestModal {
  constructor(app, editor, prefix, title) {
    super(app);
    this.editor = editor;
    this.prefix = prefix;
    this.setPlaceholder(title);
  }
  getItems() { return COLORS; }
  getItemText(item) { return item.label; }
  onChooseItem(item) { applyClass(this.editor, this.prefix + item.key); }
}

module.exports = class TextColorPlugin extends Plugin {
  onload() {
    for (const c of COLORS) {
      this.addCommand({
        id: `color-${c.key}`,
        name: `Text color: ${c.label}`,
        editorCallback: (editor) => applyClass(editor, `tc-${c.key}`),
      });
    }

    this.addCommand({
      id: 'color-pick',
      name: 'Text color: pick…',
      editorCallback: (editor) =>
        new ColorSuggest(this.app, editor, 'tc-', 'Pick a text color').open(),
    });

    this.addCommand({
      id: 'highlight-pick',
      name: 'Highlight: pick…',
      editorCallback: (editor) =>
        new ColorSuggest(this.app, editor, 'tc-hl-', 'Pick a highlight color').open(),
    });

    this.addCommand({
      id: 'color-clear',
      name: 'Text color: clear',
      editorCallback: (editor) => {
        const sel = selectWordIfEmpty(editor);
        if (!sel) return;
        editor.replaceSelection(stripColorSpans(sel));
      },
    });
  }
};

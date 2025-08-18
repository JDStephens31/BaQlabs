import { useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language?: string;
  readOnly?: boolean;
}

export default function CodeEditor({ value, onChange, language = "javascript", readOnly = false }: CodeEditorProps) {
  const editorRef = useRef<any>(null);

  // Debug logging
  console.log('CodeEditor rendered with value length:', value?.length || 0);
  console.log('Value preview:', value?.substring(0, 100) || 'No value');
  console.log('CodeEditor container dimensions');

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    console.log('Monaco editor mounted successfully');
    console.log('Monaco mounted with value:', editor.getValue().substring(0, 100));

    // Configure custom theme for trading platform
    monaco.editor.defineTheme('trading-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
        { token: 'keyword', foreground: '569CD6', fontStyle: 'bold' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'number', foreground: 'B5CEA8' },
        { token: 'regexp', foreground: 'D16969' },
        { token: 'type', foreground: '4EC9B0' },
        { token: 'class', foreground: '4EC9B0' },
        { token: 'function', foreground: 'DCDCAA' },
        { token: 'variable', foreground: '9CDCFE' },
        { token: 'constant', foreground: '4FC1FF' },
      ],
      colors: {
        'editor.background': '#0C0A09',
        'editor.foreground': '#E5E7EB',
        'editorLineNumber.foreground': '#6B7280',
        'editorLineNumber.activeForeground': '#E5E7EB',
        'editor.selectionBackground': '#264F78',
        'editor.selectionHighlightBackground': '#ADD6FF26',
        'editorCursor.foreground': '#FFFFFF',
        'editor.findMatchBackground': '#515C6A',
        'editor.findMatchHighlightBackground': '#EA5C0055',
        'editor.wordHighlightBackground': '#575757B8',
        'editor.wordHighlightStrongBackground': '#004972B8',
        'editorIndentGuide.background': '#404040',
        'editorIndentGuide.activeBackground': '#707070',
      }
    });

    monaco.editor.setTheme('trading-dark');

    // Add custom key bindings
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // Trigger save event
      window.dispatchEvent(new CustomEvent('editorSave'));
    });

    // Add trading-specific code snippets
    monaco.languages.registerCompletionItemProvider('javascript', {
      provideCompletionItems: (model: any, position: any) => {
        const suggestions = [
          {
            label: 'onMarketData',
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: 'function onMarketData(book, trades, marketData) {\n  // Process market data\n  const bestBid = book.bids[0];\n  const bestAsk = book.asks[0];\n  const midPrice = (bestBid.price + bestAsk.price) / 2;\n  \n  $0\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Main market data handler function'
          },
          {
            label: 'placeLimitOrder',
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: 'placeLimitOrder(\'${1|BUY,SELL|}\', ${2:price}, ${3:size});',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Place a limit order'
          },
          {
            label: 'calculateImbalance',
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: 'function calculateImbalance(book) {\n  let bidSize = 0, askSize = 0;\n  const levels = Math.min(5, book.bids.length, book.asks.length);\n  \n  for (let i = 0; i < levels; i++) {\n    bidSize += book.bids[i].size;\n    askSize += book.asks[i].size;\n  }\n  \n  return (bidSize - askSize) / (bidSize + askSize);\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Calculate order book imbalance'
          },
          {
            label: 'riskManagement',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '// Risk management\nif (Math.abs(position) > maxPosition) {\n  // Reduce position\n  const reduceSize = Math.min(2, Math.abs(position) - maxPosition);\n  if (position > 0) {\n    placeLimitOrder(\'SELL\', currentPrice - 0.5, reduceSize);\n  } else {\n    placeLimitOrder(\'BUY\', currentPrice + 0.5, reduceSize);\n  }\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Basic risk management template'
          }
        ];
        return { suggestions };
      }
    });
  };

  const handleEditorChange = (newValue: string | undefined) => {
    console.log('Editor value changed, new length:', newValue?.length || 0);
    if (newValue !== undefined && onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className="w-full h-full">
      <Editor
        height="600px"
        defaultLanguage={language}
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          readOnly: readOnly,
          fontSize: 14,
          fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace',
          lineHeight: 24,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 16, bottom: 16 },
          lineNumbers: 'on',
          glyphMargin: false,
          folding: true,
          lineDecorationsWidth: 0,
          lineNumbersMinChars: 3,
          renderLineHighlight: 'line',
          selectionHighlight: false,
          bracketPairColorization: { enabled: true },
          suggest: {
            showKeywords: true,
            showSnippets: true,
            showFunctions: true,
            showConstructors: true,
            showFields: true,
            showVariables: true,
            showClasses: true,
            showStructs: true,
            showInterfaces: true,
            showModules: true,
            showProperties: true,
            showEvents: true,
            showOperators: true,
            showUnits: true,
            showValues: true,
            showConstants: true,
            showEnums: true,
            showEnumMembers: true,
            showColors: true,
            showFiles: true,
            showReferences: true,
            showFolders: true,
            showTypeParameters: true,
          },
          quickSuggestions: {
            other: true,
            comments: false,
            strings: false
          },
          wordWrap: 'on',
          wrappingIndent: 'indent',
          tabSize: 2,
          insertSpaces: true,
          detectIndentation: false,
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          renderWhitespace: 'boundary',
          showFoldingControls: 'mouseover',
          dragAndDrop: true,
          links: true,
          colorDecorators: true,
          contextmenu: true,
          mouseWheelZoom: true,
        }}
        loading={
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current"></div>
            <span className="ml-3">Loading Monaco editor...</span>
          </div>
        }
        beforeMount={(monaco) => {
          console.log('Monaco is about to mount');
        }}
      />
    </div>
  );
}
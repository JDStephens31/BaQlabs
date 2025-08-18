import { useEffect, useRef, useState } from "react";

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language?: string;
  readOnly?: boolean;
}

export default function CodeEditor({ value, onChange, language = "javascript", readOnly = false }: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    // Enhanced syntax highlighting for JavaScript
    if (editorRef.current) {
      const highlighted = value
        .replace(/(function|const|let|var|if|else|return|for|while|try|catch|async|await|class|extends|import|export|default)/g, '<span class="text-blue-400 font-semibold">$1</span>')
        .replace(/(\/\/.*$)/gm, '<span class="text-green-500 italic">$1</span>')
        .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-green-500 italic">$1</span>')
        .replace(/(".*?"|'.*?'|`.*?`)/g, '<span class="text-yellow-400">$1</span>')
        .replace(/(\d+\.?\d*)/g, '<span class="text-purple-400">$1</span>')
        .replace(/(true|false|null|undefined)/g, '<span class="text-orange-400">$1</span>');
      
      editorRef.current.innerHTML = highlighted;
    }
  }, [value]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange?.(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange?.(newValue);
      
      // Set cursor position after the inserted spaces
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div className="flex-1 relative">
      {/* Syntax highlighted display */}
      <div 
        ref={editorRef}
        className="absolute inset-0 p-4 font-mono text-sm leading-6 overflow-auto custom-scrollbar pl-14 pointer-events-none"
        style={{ 
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          color: 'transparent'
        }}
      />
      
      {/* Editable textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleTextareaChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="absolute inset-0 p-4 font-mono text-sm leading-6 overflow-auto custom-scrollbar pl-14 bg-transparent text-transparent caret-white resize-none outline-none"
        style={{ 
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word'
        }}
        spellCheck={false}
        readOnly={readOnly}
        placeholder={readOnly ? "" : "// Start typing your strategy code here..."}
      />
      
      {/* Overlay for text visibility */}
      <div 
        className="absolute inset-0 p-4 font-mono text-sm leading-6 overflow-auto custom-scrollbar pl-14 pointer-events-none"
        style={{ 
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          color: isFocused ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.8)'
        }}
        dangerouslySetInnerHTML={{ __html: value
          .replace(/(function|const|let|var|if|else|return|for|while|try|catch|async|await|class|extends|import|export|default)/g, '<span class="text-blue-400 font-semibold">$1</span>')
          .replace(/(\/\/.*$)/gm, '<span class="text-green-500 italic">$1</span>')
          .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-green-500 italic">$1</span>')
          .replace(/(".*?"|'.*?'|`.*?`)/g, '<span class="text-yellow-400">$1</span>')
          .replace(/(\d+\.?\d*)/g, '<span class="text-purple-400">$1</span>')
          .replace(/(true|false|null|undefined)/g, '<span class="text-orange-400">$1</span>')
        }}
      />
      
      {/* Line numbers */}
      <div className="absolute left-0 top-0 w-12 h-full bg-muted border-r border-border p-4 text-right font-mono text-xs text-muted-foreground">
        {value.split('\n').map((_, index) => (
          <div key={index} className="leading-6">
            {index + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
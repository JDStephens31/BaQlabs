import { useEffect, useRef } from "react";

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language?: string;
}

export default function CodeEditor({ value, onChange, language = "javascript" }: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simple syntax highlighting for demo purposes
    // In a real implementation, you would use Monaco Editor or similar
    if (editorRef.current) {
      const highlighted = value
        .replace(/(function|const|if|else|return)/g, '<span class="syntax-keyword">$1</span>')
        .replace(/(\/\/.*$)/gm, '<span class="syntax-comment">$1</span>')
        .replace(/(".*?")/g, '<span class="syntax-string">$1</span>')
        .replace(/(\d+\.?\d*)/g, '<span class="syntax-string">$1</span>');
      
      editorRef.current.innerHTML = highlighted;
    }
  }, [value]);

  return (
    <div className="flex-1 relative">
      <div 
        ref={editorRef}
        className="h-full p-4 font-mono text-sm leading-relaxed overflow-auto custom-scrollbar pl-14"
        style={{ whiteSpace: 'pre-wrap' }}
      />
      
      {/* Line numbers */}
      <div className="absolute left-0 top-0 w-12 h-full bg-muted border-r border-border p-4 text-right font-mono text-xs text-muted-foreground">
        {value.split('\n').map((_, index) => (
          <div key={index} className="leading-relaxed">
            {index + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
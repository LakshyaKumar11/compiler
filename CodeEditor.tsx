import React from 'react';
import { Play, Trash2, FileText, Loader } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  onCompile: () => void;
  onClear: () => void;
  onLoadSample: () => void;
  isCompiling: boolean;
}

export function CodeEditor({ 
  code, 
  onChange, 
  onCompile, 
  onClear, 
  onLoadSample, 
  isCompiling 
}: CodeEditorProps) {
  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={onCompile}
          disabled={isCompiling || !code.trim()}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
        >
          {isCompiling ? (
            <Loader className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Play className="w-4 h-4 mr-2" />
          )}
          {isCompiling ? 'Compiling...' : 'Compile'}
        </button>
        
        <button
          onClick={onLoadSample}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-sm"
        >
          <FileText className="w-4 h-4 mr-2" />
          Load Sample
        </button>
        
        <button
          onClick={onClear}
          className="inline-flex items-center px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors duration-200 font-medium shadow-sm"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear
        </button>
      </div>

      {/* Code Textarea */}
      <div className="relative">
        <textarea
          value={code}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your C code here..."
          className="w-full h-96 p-4 bg-slate-50 border border-slate-300 rounded-lg font-mono text-sm leading-6 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          spellCheck={false}
        />
        
        {/* Line numbers overlay could be added here */}
        <div className="absolute top-4 right-4 text-xs text-slate-400 bg-white px-2 py-1 rounded">
          Lines: {code.split('\n').length}
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { Code, Cpu, Zap } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
              <Code className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Mini C Compiler</h1>
              <p className="text-slate-600">Interactive Parser & Analyzer</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-slate-600">
              <Cpu className="w-5 h-5" />
              <span className="text-sm">Lexical Analysis</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-600">
              <Zap className="w-5 h-5" />
              <span className="text-sm">Syntax Parsing</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
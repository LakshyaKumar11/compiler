import React, { useState } from 'react';
import { CodeEditor } from './components/CodeEditor';
import { CompilerOutput } from './components/CompilerOutput';
import { Header } from './components/Header';
import { compileCode } from './utils/compiler';
import type { CompilationResult } from './types/compiler';

function App() {
  const [code, setCode] = useState(`int x;
x = 10;
main() {
    printf("Hello World");
    return 0;
}`);
  
  const [compilationResult, setCompilationResult] = useState<CompilationResult | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);

  const handleCompile = async () => {
    setIsCompiling(true);
    try {
      const result = await compileCode(code);
      setCompilationResult(result);
    } catch (error) {
      console.error('Compilation error:', error);
    } finally {
      setIsCompiling(false);
    }
  };

  const handleClear = () => {
    setCode('');
    setCompilationResult(null);
  };

  const handleLoadSample = () => {
    setCode(`#include <stdio.h>

int factorial(int n) {
    if (n <= 1) {
        return 1;
    }
    return n * factorial(n - 1);
}

int main() {
    int num = 5;
    int result = factorial(num);
    printf("Factorial of %d is %d", num, result);
    return 0;
}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Code Editor Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-slate-200">
              <div className="px-6 py-4 border-b border-slate-200">
                <h2 className="text-xl font-semibold text-slate-800 flex items-center">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                  Code Editor
                </h2>
              </div>
              
              <div className="p-6">
                <CodeEditor 
                  code={code} 
                  onChange={setCode}
                  onCompile={handleCompile}
                  onClear={handleClear}
                  onLoadSample={handleLoadSample}
                  isCompiling={isCompiling}
                />
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            <CompilerOutput result={compilationResult} isCompiling={isCompiling} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
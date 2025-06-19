import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Hash, Type, Loader } from 'lucide-react';
import type { CompilationResult } from '../types/compiler';

interface CompilerOutputProps {
  result: CompilationResult | null;
  isCompiling: boolean;
}

export function CompilerOutput({ result, isCompiling }: CompilerOutputProps) {
  if (isCompiling) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800 flex items-center">
            <Loader className="w-5 h-5 mr-3 animate-spin text-blue-600" />
            Compiling...
          </h2>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader className="w-12 h-12 mx-auto text-blue-600 animate-spin mb-4" />
              <p className="text-slate-600">Analyzing your code...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800 flex items-center">
            <span className="w-2 h-2 bg-slate-400 rounded-full mr-3"></span>
            Compilation Output
          </h2>
        </div>
        <div className="p-6">
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 mx-auto text-slate-400 mb-4" />
            <p className="text-slate-600 text-lg font-medium mb-2">No compilation results yet</p>
            <p className="text-slate-500">Enter some C code and click compile to see the analysis</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800 flex items-center">
            {result.success ? (
              <CheckCircle className="w-5 h-5 mr-3 text-emerald-600" />
            ) : (
              <XCircle className="w-5 h-5 mr-3 text-red-600" />
            )}
            Compilation Status
          </h2>
        </div>
        <div className="p-6">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            result.success 
              ? 'bg-emerald-100 text-emerald-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {result.success ? 'Compilation Successful' : 'Compilation Failed'}
          </div>
          
          {result.message && (
            <p className="mt-3 text-slate-600">{result.message}</p>
          )}
        </div>
      </div>

      {/* Errors */}
      {result.errors && result.errors.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-red-200">
          <div className="px-6 py-4 border-b border-red-200">
            <h3 className="text-lg font-semibold text-red-800 flex items-center">
              <XCircle className="w-5 h-5 mr-2" />
              Errors ({result.errors.length})
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {result.errors.map((error, index) => (
                <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 font-medium">Line {error.line}: {error.message}</p>
                  {error.details && (
                    <p className="text-red-600 text-sm mt-1">{error.details}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Symbol Table */}
      {result.symbolTable && result.symbolTable.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center">
              <Type className="w-5 h-5 mr-2 text-blue-600" />
              Symbol Table ({result.symbolTable.length} entries)
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Token</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Line Numbers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {result.symbolTable.map((symbol, index) => (
                  <tr key={index} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-900">{symbol.token}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        symbol.type === 'Identifier' ? 'bg-blue-100 text-blue-800' :
                        symbol.type === 'Keyword' ? 'bg-purple-100 text-purple-800' :
                        symbol.type === 'Operator' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {symbol.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{symbol.lines}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Constant Table */}
      {result.constantTable && result.constantTable.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center">
              <Hash className="w-5 h-5 mr-2 text-emerald-600" />
              Constant Table ({result.constantTable.length} entries)
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Line Numbers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {result.constantTable.map((constant, index) => (
                  <tr key={index} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-900">{constant.value}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800">
                        {constant.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{constant.lines}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
import type { CompilationResult, SymbolTableEntry, ConstantTableEntry, CompilationError, Token } from '../types/compiler';

// Simulated lexical analysis - extracts tokens from C code
function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  const lines = code.split('\n');
  
  // Keywords
  const keywords = new Set([
    'int', 'float', 'char', 'double', 'void', 'if', 'else', 'while', 'for', 
    'return', 'main', 'printf', 'scanf', 'include', 'stdio'
  ]);
  
  // Operators
  const operators = new Set([
    '+', '-', '*', '/', '%', '=', '==', '!=', '<', '>', '<=', '>=',
    '&&', '||', '!', '++', '--', '+=', '-=', '*=', '/=', '%='
  ]);
  
  lines.forEach((line, lineIndex) => {
    const lineNum = lineIndex + 1;
    
    // Remove comments
    line = line.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/g, '');
    
    // Token pattern matching
    const tokenPattern = /[a-zA-Z_][a-zA-Z0-9_]*|[0-9]+\.?[0-9]*|"[^"]*"|'[^']*'|[+\-*/%=<>!&|]+|[(){};,]/g;
    let match;
    
    while ((match = tokenPattern.exec(line)) !== null) {
      const value = match[0];
      let type = 'Unknown';
      
      if (keywords.has(value)) {
        type = 'Keyword';
      } else if (/^[0-9]+\.?[0-9]*$/.test(value)) {
        type = 'Constant';
      } else if (/^"[^"]*"$/.test(value) || /^'[^']*'$/.test(value)) {
        type = 'String';
      } else if (operators.has(value)) {
        type = 'Operator';
      } else if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(value)) {
        type = 'Identifier';
      } else if (/^[(){};,]$/.test(value)) {
        type = 'Punctuator';
      }
      
      tokens.push({ type, value, line: lineNum });
    }
  });
  
  return tokens;
}

// Validate syntax and generate errors
function validateSyntax(code: string): CompilationError[] {
  const errors: CompilationError[] = [];
  const lines = code.split('\n');
  
  let braceCount = 0;
  let parenCount = 0;
  let hasMain = false;
  
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmed = line.trim();
    
    if (trimmed.includes('main')) {
      hasMain = true;
    }
    
    // Check brace matching
    for (const char of trimmed) {
      if (char === '{') braceCount++;
      if (char === '}') braceCount--;
      if (char === '(') parenCount++;
      if (char === ')') parenCount--;
    }
    
    // Check for common syntax errors
    if (trimmed.endsWith('{') && trimmed.includes('if') && !trimmed.includes('(')) {
      errors.push({
        line: lineNum,
        message: 'Missing condition in if statement',
        details: 'If statements require a condition in parentheses'
      });
    }
    
    if (trimmed.includes('printf') && !trimmed.includes('(')) {
      errors.push({
        line: lineNum,
        message: 'Missing parentheses in function call',
        details: 'Function calls require parentheses'
      });
    }
  });
  
  if (!hasMain && code.trim()) {
    errors.push({
      line: 1,
      message: 'Missing main function',
      details: 'C programs require a main function as entry point'
    });
  }
  
  if (braceCount !== 0) {
    errors.push({
      line: lines.length,
      message: 'Mismatched braces',
      details: `${braceCount > 0 ? 'Missing closing' : 'Extra closing'} brace(s)`
    });
  }
  
  if (parenCount !== 0) {
    errors.push({
      line: lines.length,
      message: 'Mismatched parentheses',
      details: `${parenCount > 0 ? 'Missing closing' : 'Extra closing'} parenthesis`
    });
  }
  
  return errors;
}

// Generate symbol table from tokens
function generateSymbolTable(tokens: Token[]): SymbolTableEntry[] {
  const symbolMap = new Map<string, { type: string; lines: number[] }>();
  
  tokens.forEach(token => {
    if (token.type === 'Identifier' || token.type === 'Keyword' || token.type === 'Operator' || token.type === 'Punctuator') {
      const key = token.value;
      if (symbolMap.has(key)) {
        const entry = symbolMap.get(key)!;
        if (!entry.lines.includes(token.line)) {
          entry.lines.push(token.line);
        }
      } else {
        symbolMap.set(key, { type: token.type, lines: [token.line] });
      }
    }
  });
  
  return Array.from(symbolMap.entries()).map(([token, data]) => ({
    token,
    type: data.type,
    lines: data.lines.sort((a, b) => a - b).join(', ')
  }));
}

// Generate constant table from tokens
function generateConstantTable(tokens: Token[]): ConstantTableEntry[] {
  const constantMap = new Map<string, { type: string; lines: number[] }>();
  
  tokens.forEach(token => {
    if (token.type === 'Constant' || token.type === 'String') {
      const key = token.value;
      const type = token.type === 'String' ? 'String Literal' : 'Numeric Constant';
      
      if (constantMap.has(key)) {
        const entry = constantMap.get(key)!;
        if (!entry.lines.includes(token.line)) {
          entry.lines.push(token.line);
        }
      } else {
        constantMap.set(key, { type, lines: [token.line] });
      }
    }
  });
  
  return Array.from(constantMap.entries()).map(([value, data]) => ({
    value,
    type: data.type,
    lines: data.lines.sort((a, b) => a - b).join(', ')
  }));
}

// Main compilation function
export async function compileCode(code: string): Promise<CompilationResult> {
  // Simulate compilation delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (!code.trim()) {
    return {
      success: false,
      message: 'No code provided',
      errors: [{ line: 1, message: 'Empty input', details: 'Please enter some C code to compile' }]
    };
  }
  
  // Tokenize the code
  const tokens = tokenize(code);
  
  // Validate syntax
  const errors = validateSyntax(code);
  
  // Generate tables
  const symbolTable = generateSymbolTable(tokens);
  const constantTable = generateConstantTable(tokens);
  
  const success = errors.length === 0;
  
  return {
    success,
    message: success ? 'Code compiled successfully!' : `Found ${errors.length} error(s)`,
    errors: errors.length > 0 ? errors : undefined,
    symbolTable,
    constantTable
  };
}
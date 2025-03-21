'use client'

import Editor, { BeforeMount } from '@monaco-editor/react'
import { memo, useMemo } from 'react'

const BOILERPLATE_CODE = {
  java: `public class Main {

    public static void main(String[] args) {
        // Your code here
        
    }
}`,
  python: `# Your Python code here
`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    // Your code here
    
    return 0;
}`,
  javascript: `// Your JavaScript code here
`,
  typescript: `// Your TypeScript code here
`,
  c: `#include <stdio.h>

      int main() {
          // Your code here
      }
`,
} as const

interface MonacoEditorProps {
  defaultValue?: string
  language?: string
  onChange?: (value: string | undefined) => void
}

const editorOptions = {
  minimap: { enabled: false },
  fontSize: 16,
  fontFamily: "'Space Mono', monospace",
  fontLigatures: true,
  scrollBeyondLastLine: false,
  automaticLayout: true,
  formatOnPaste: true,
  formatOnType: true,
  wordWrap: 'on',
} as const

function MonacoEditorComponent({ onChange, language }: MonacoEditorProps) {
  const memoizedOptions = useMemo(() => editorOptions, [])

  const defaultValue = useMemo(() => {
    return BOILERPLATE_CODE[language as keyof typeof BOILERPLATE_CODE] || ''
  }, [language])

  const handleBeforeMount: BeforeMount = (monaco) => {
    
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
    })
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
    })
  }

  return (
    <Editor
      height="80vh"
      theme='vs-dark'
      language={language}
      value={defaultValue}
      onChange={onChange}
      options={memoizedOptions}
      beforeMount={handleBeforeMount}
    />
  )
}

export const MonacoEditor = memo(MonacoEditorComponent)
'use client'

import { useState, useCallback } from 'react'
import { MonacoEditor } from './monaco-editor'
import { debounce } from 'lodash'

const LANGUAGE_IDS = {
  javascript: 63,
  typescript: 74,
  python: 71,
  java: 62,
  cpp: 54,
  c: 50,
} as const;

export function CodeEditor() {

  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)

  const debouncedSetCode = useCallback(
    debounce((value: string) => {
      setCode(value)
    }, 500),
    []
  )

  const handleCodeChange = useCallback((value: string | undefined) => {
    if (value !== undefined) {
      debouncedSetCode(value)
    }
  }, [debouncedSetCode])


  const runCode = async () => {
    setIsRunning(true)
    setOutput('')

    try {
        const submitResponse = await fetch(`http://localhost:2358/submissions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                source_code: code,
                language_id: LANGUAGE_IDS[language as keyof typeof LANGUAGE_IDS],
                stdin: ''
            })
        })

        const submission = await submitResponse.json()
        
        // Progressive delay strategy
        let delay = 100 // Start with 100ms
        let attempts = 20

        while(attempts > 0) {
            const response = await fetch(`http://localhost:2358/submissions/${submission.token}`)
            const result = await response.json()

            if(result.status.id !== 1 && result.status.id !== 2) {
                setOutput(result.stdout || result.stderr || result.compile_output || 'No output')
                break
            }

            attempts--
            // Exponential backoff with a maximum of 1000ms
            delay = Math.min(delay * 1.5, 1000)
            await new Promise(resolve => setTimeout(resolve, delay))
        }
    } catch (error) {
        setOutput('Error executing code. Please try again.')
        console.error('Code execution error:', error)
    } finally {
        setIsRunning(false)
    }
}

  return (
    <div className="flex gap-4">
      <div className='flex-1 flex flex-col gap 4 '>
        <div className="flex justify-between items-center">
          <select 
            className="p-2 border rounded"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="c">C</option>
          </select>
          <button 
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
            onClick={runCode}
            disabled={isRunning || !code.trim()}
          >
            {isRunning ? 'Running...' : 'Run Code'}
          </button>
        </div>

        <MonacoEditor 
            onChange={handleCodeChange} 
            language={language}
        />
      </div>

      <div className="flex-1">

        <h2 className="text-lg font-semibold mb-2">Output</h2>
        <pre className="whitespace-pre-wrap">{output}</pre>

      </div>
    </div>
  )
}
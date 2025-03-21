"use client";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { useState } from "react";
import Editor from "@monaco-editor/react";
import { FiCopy } from "react-icons/fi";

export default function ReadmePreviewPage() {
  const [source, setSource] = useState(defaultData);


  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(source);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <div className="overflow-hidden relative">
            <button
              onClick={handleCopy}
              className="absolute top-2 right-4 z-50 p-2 rounded cursor-pointer bg-gray-100 hover:bg-gray-200"
              title="Copy to clipboard"
            >
              <FiCopy className="w-5 h-5" />
            </button>
            <Editor
              height="90vh"
              defaultLanguage="markdown"
              theme="light"
              value={source}
              onChange={(value) => setSource(value || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "'Space Mono', monospace",
                wordWrap: "on",
                lineNumbers: "on",
                folding: true,
              }}
            />
          </div>
        </div>

        <div>
          <div data-color-mode={"light"} className="h-[90vh] overflow-y-auto">
            <MarkdownPreview source={source}  className="p-2"/>
          </div>
        </div>
      </div>
    </div>
  );
}

const defaultData = `# Markdown syntax guide

## Headers

# This is a Heading h1
## This is a Heading h2
###### This is a Heading h6

## Emphasis

*This text will be italic*  
_This will also be italic_

**This text will be bold**  
__This will also be bold__

_You **can** combine them_

## Lists

### Unordered

* Item 1
* Item 2
* Item 2a
* Item 2b
    * Item 3a
    * Item 3b

### Ordered

1. Item 1
2. Item 2
3. Item 3
    1. Item 3a
    2. Item 3b

## Links

You may be using [Markdown Live Preview](https://markdownlivepreview.com/).

## Blockquotes

> Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.
>
>> Markdown is often used to format readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.

## Tables


| Left columns  | Right columns |
| ------------- |:-------------:|
| left foo      | right foo     |
| left bar      | right bar     |
| left baz      | right baz     |

## Blocks of code

\`\`\`
let message = 'Hello world';
alert(message);
\`\`\`

## Inline code

This web site is using \`markedjs/marked\`.`;

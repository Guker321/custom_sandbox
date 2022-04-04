import React, { useRef } from 'react';
import MonacoEditor, { OnMount, OnChange } from '@monaco-editor/react';
import { observer } from 'mobx-react-lite';
import editorStore from '../store/editorStore';
import prettier from 'prettier';
import parser, { parsers } from 'prettier/parser-babel'

type CodeEditorProps = {
  initialValue: string;
};

const CodeEditor: React.FC<CodeEditorProps> = observer(({ initialValue }) => {
  const editorRef = useRef<any>();

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
    console.log(editorRef.current.getValue());
    editor.getModel()?.updateOptions({ tabSize: 2 })
  }

  const onChangeHandler: OnChange = (value: string | undefined) => {
    if (value) {
      editorStore.setCode(value);
    }
  };
  const onFormatClick = () => {
    const unformattedCode = editorRef.current.getValue();

    const formattedCode = prettier.format(unformattedCode, {
      parser: 'babel',
      plugins: [parser],
      useTabs: false,
      semi: true,
      singleQuote: true,
    });

    editorRef.current.setValue(formattedCode);
  }

  return <div>
    <button onClick={onFormatClick}>Format</button>
    <MonacoEditor
      onChange={onChangeHandler}
      onMount={handleEditorDidMount}
      value={initialValue}
      theme='vs-dark'
      language='javascript'
      height='500px'
      options={
        {
          wordWrap: 'on',
          minimap: { enabled: false },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }
      } />
  </div>
});

export default CodeEditor;
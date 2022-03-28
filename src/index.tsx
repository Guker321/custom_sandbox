import * as esbuild from 'esbuild-wasm';
import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';


const App = () => {
  const [input, setInput] = useState('');
  const [code, setCode] = useState<any>();
  const codeRef: any = useRef();

  const startService = async () => {
    await esbuild.initialize({
      worker: true,
      wasmURL: '/esbuild.wasm'
    });
    codeRef.current = true;
    console.log('esbuild init!')
  };

  const submitCodeHanlder = async () => {
    if (!codeRef.current) {
      return;
    }
    // const result = await esbuild.transform(input, {
    //   loader: 'jsx',
    //   target: 'es2015',
    // })

    const result = await esbuild.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin()]
    })
    console.log(result.outputFiles[0].text);
    setCode(result.outputFiles[0].text);
  };

  const inputHandler: React.ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    setInput(event.target.value);
  };

  useEffect(() => {
    startService();
  }, []);

  return (
    <div>
      <textarea value={input} onChange={inputHandler}></textarea>
      <div>
        <button onClick={submitCodeHanlder}>Submit</button>
      </div>
      <pre>{code}</pre>
    </div>
  )
}

ReactDOM.render(<App />, document.querySelector('#root'))
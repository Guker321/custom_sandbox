import * as esbuild from 'esbuild-wasm';
import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';


const App = () => {
  const [input, setInput] = useState('');
  const [code, setCode] = useState<any>();
  const codeRef: any = useRef();
  const iframe: any = useRef();

  const startService = async () => {
    await esbuild.initialize({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.14.28/esbuild.wasm'
    });
    codeRef.current = true;
    console.log('esbuild init!')
  };

  const submitCodeHanlder = async () => {
    if (!codeRef.current) {
      return;
    };

    const result = await esbuild.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
    });
    // setCode(result.outputFiles[0].text);
    iframe.current.contentWindow.postMessage(result.outputFiles[0].text, '*');
  };

  const html = `
    <html>
      <head></head>
      <body>
        <div id='root'></div>
        <script>
          window.addEventListener('message', (event) => {
            eval(event.data);
          }, false);
        </script>
      </body>
    </html>
  `;

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
      <iframe ref={iframe} title='box' sandbox='allow-scripts' srcDoc={html}></iframe>
    </div>
  )
};

ReactDOM.render(<App />, document.querySelector('#root'))
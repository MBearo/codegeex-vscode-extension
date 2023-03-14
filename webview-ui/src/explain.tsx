import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import {
  VSCodeButton,
  VSCodeOption,
  VSCodeDropdown,
  VSCodeProgressRing
} from "@vscode/webview-ui-toolkit/react";
import type { WebviewApi } from "vscode-webview";
import hljs from 'highlight.js'
import 'highlight.js/styles/vs2015.css'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import "./index.css";

let vscode: WebviewApi<unknown>;
if (typeof acquireVsCodeApi === "function") {
  vscode = acquireVsCodeApi();
}
const LanguageList = [{
  label: 'English',
  value: 'en-US'
}, {
  label: 'Chinese',
  value: 'zh-CN'
}]
function App() {
  const [code, setCode] = useState("please selected text");
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState("")
  const [lang, setLang] = useState('en-US')

  const onSubmit = () => {
    setLoading(true)
    vscode.postMessage({
      command: "codegeex.explain",
      payload: {
        code,
        locale: lang
      },
    });
  };
  const onLanguageChange = (e: any) => {
    setLang(e.target.value)
  };
  const handler = (event: any) => {
    const { command, payload } = event.data;
    if (command === "codegeex.selectedText") {
      setCode(payload);
      setTimeout(() => {
        hljs.highlightElement(document.getElementById("highlight")!);
      });
    } else if (command === "codegeex.explainResult") {
      setResult(payload)
      setLoading(false)
      setTimeout(() => {
        hljs.highlightElement(document.getElementById("result-highlight")!);
      })
    }
  };
  useEffect(() => {
    window.addEventListener("message", handler);
    return () => {
      window.removeEventListener("message", handler);
    };
  }, []);

  return (
    <main>
      <section>
        <pre>
          <code id='highlight'>
            {code}
          </code>
        </pre>
      </section>
      <div className="sub-title">Explain code into</div>
      <VSCodeDropdown className="mb-16" value={lang} onChange={onLanguageChange}>
        {LanguageList.map(({ value, label }) => <VSCodeOption value={value}>{label}</VSCodeOption>)}
      </VSCodeDropdown>
      <VSCodeButton className="mb-16" onClick={onSubmit} disabled={loading}>Ask Codegeex</VSCodeButton>
      {loading && <VSCodeProgressRing />}
      {result && (
        <>
          <section className="mb-16">
            <pre>
              <code id='result-highlight'>
                {result}
              </code>
            </pre>
          </section>
          <CopyToClipboard text={result}>
            <VSCodeButton appearance="secondary">Copy</VSCodeButton>
          </CopyToClipboard>
        </>
      )}
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

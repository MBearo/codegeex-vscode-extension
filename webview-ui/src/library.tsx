import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { VSCodeButton ,VSCodeProgressRing} from "@vscode/webview-ui-toolkit/react";
import type { WebviewApi } from "vscode-webview";
import "./index.css";
import { explainTemplate, debugTemplate, addTypesTemplate } from "./template";

let vscode: WebviewApi<unknown>;
if (typeof acquireVsCodeApi === "function") {
  vscode = acquireVsCodeApi();
}
function App() {
  const [code, setCode] = useState("please selected text");
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)

  const handler = (event: any) => {
    const { command, payload } = event.data;
    if (command === "codegeex.selectedText") {
      setCode(payload);
    } else if (command === "codegeex.templateResult") {
      setLoading(false)
      setResult(payload);
    }
  };
  const onAddType = () => {
    setLoading(true)
    vscode.postMessage({
      command: "codegeex.template",
      payload: {
        code: addTypesTemplate(code),
      },
    });
  }
  const onExplain = () => {
    setLoading(true)
    vscode.postMessage({
      command: "codegeex.template",
      payload: {
        code: explainTemplate(code),
      },
    });
  }
  const onDebug = () => {
    setLoading(true)
    vscode.postMessage({
      command: "codegeex.template",
      payload: {
        code: debugTemplate(code),
      },
    });
  }
  useEffect(() => {
    window.addEventListener("message", handler);
    return () => {
      window.removeEventListener("message", handler);
    };
  }, []);
  return (
    <main>
      <pre>{code}</pre>
      <div className="btn-container">
        <VSCodeButton appearance="secondary" onClick={onAddType}>TS: Add Types</VSCodeButton>
        <VSCodeButton appearance="secondary" onClick={onDebug}>JS: Debug</VSCodeButton>
        <VSCodeButton appearance="secondary" onClick={onExplain}>Python: Explain</VSCodeButton>
      </div>
      {loading && <VSCodeProgressRing />}
      <pre>{result}</pre>
    </main>
  )
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { VSCodeButton ,VSCodeProgressRing} from "@vscode/webview-ui-toolkit/react";
import type { WebviewApi } from "vscode-webview";
import "./index.css";

const AddTypesTemplate = (material: string) => `
// language: TypeScript

function sum(array) {
  return array.reduce((acc, cur) => acc + cur, 0);
}


${material}

// add types
function sum(array: number[]): number {
  return array.reduce((acc: number, cur: number) => acc + cur, 0);
}

// add types
`
const ExplainTemplate = (material: string) => `
# language: Python

def sum_squares(lst):
    sum = 0
    for i in range(len(lst)):
        if i % 3 == 0:
            lst[i] = lst[i]**2
        elif i % 4 == 0:
            lst[i] = lst[i]**3
        sum += lst[i]
    return sum

${material}

# Explain the code line by line
def sum_squares(lst):
    # initialize sum
    sum = 0
    # loop through the list
    for i in range(len(lst)):
        # if the index is a multiple of 3
        if i % 3 == 0:
            # square the entry
            lst[i] = lst[i]**2
        # if the index is a multiple of 4
        elif i % 4 == 0:
            # cube the entry
            lst[i] = lst[i]**3
        # add the entry to the sum
        sum += lst[i]
    # return the sum
    return sum

# Explain the code line by line
`

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
        code: AddTypesTemplate(code),
      },
    });
  }
  const onExplain = () => {
    setLoading(true)
    vscode.postMessage({
      command: "codegeex.template",
      payload: {
        code: ExplainTemplate(code),
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

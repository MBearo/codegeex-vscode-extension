import {
  Disposable,
  Webview,
  WebviewPanel,
  window,
  Uri,
  ViewColumn,
  WebviewViewProvider,
  WebviewView,
  WebviewViewResolveContext,
  CancellationToken,
} from "vscode";
import getUri from "../utils/getUri";
import getNonce from "../utils/getNonce";
import getDocumentLanguage from "../utils/getDocumentLanguage";
import { getCodeTranslation } from "../utils/getCodeTranslation";
import { getCodeExplain } from '../utils/getCodeExplain'
import { getCodeCompletions } from "../utils/getCodeCompletions";
import { apiKey, apiSecret } from "../localconfig";

export default class SidebarWebviewProvider implements WebviewViewProvider {
  public static currentPanel: SidebarWebviewProvider | undefined;
  private webviewView: WebviewView | undefined;
  // private readonly _panel: WebviewPanel;
  private _disposables: Disposable[] = [];
  private type: string;
  constructor(private readonly _extensionUri: Uri, type: string) {
    this.type = type;
  }
  public resolveWebviewView(
    webviewView: WebviewView,
    context: WebviewViewResolveContext,
    _token: CancellationToken
  ) {
    this.webviewView = webviewView;
    // Allow scripts in the webview
    webviewView.webview.options = {
      enableScripts: true,
    };

    // Set the HTML content that will fill the webview view
    webviewView.webview.html = this._getWebviewContent(
      webviewView.webview,
      this._extensionUri
    );

    // Sets up an event listener to listen for messages passed from the webview view context
    // and executes code based on the message that is recieved
    this._setWebviewMessageListener(webviewView.webview);
  }

  /**
   * Defines and returns the HTML that should be rendered within the webview panel.
   *
   * @remarks This is also the place where references to the React webview build files
   * are created and inserted into the webview HTML.
   *
   * @param webview A reference to the extension webview
   * @param extensionUri The URI of the directory containing the extension
   * @returns A template string literal containing the HTML that should be
   * rendered within the webview panel
   */
  private _getWebviewContent(webview: Webview, extensionUri: Uri) {
    // The JS file from the React build output
    const scriptUri = getUri(webview, extensionUri, [
      "webview-ui",
      "build",
      "assets",
      `${this.type}.js`,
    ]);
    // The JS file from the React build output
    const commonScriptUri = getUri(webview, extensionUri, [
      "webview-ui",
      "build",
      "assets",
      "index.js",
    ]);
    // The CSS file from the React build output
    const commonStylestUri = getUri(webview, extensionUri, [
      "webview-ui",
      "build",
      "assets",
      "index.css",
    ]);
    // The CSS file from the React build output
    const commonStylestUri2 = getUri(webview, extensionUri, [
      "webview-ui",
      "build",
      "assets",
      "index2.css",
    ]);

    const nonce = getNonce();

    // Tip: Install the es6-string-html VS Code extension to enable code highlighting below
    return /*html*/ `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
            <link rel="stylesheet" type="text/css" href="${commonStylestUri2}">
            <link rel="stylesheet" type="text/css" href="${commonStylestUri}">
            <title>CodeGeex</title>
          </head>
          <body>
            <div id="root"></div>
            <script type="module" nonce="${nonce}" src="${commonScriptUri}"></script>
            <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
          </body>
        </html>
      `;
  }
  /**
   * Sets up an event listener to listen for messages passed from the webview context and
   * executes code based on the message that is recieved.
   *
   * @param webview A reference to the extension webview
   * @param context A reference to the extension context
   */
  private _setWebviewMessageListener(webview: Webview) {
    webview.onDidReceiveMessage(
      async (message: any) => {
        const command = message.command;
        const payload = message.payload;
        switch (command) {
          case "codegeex.translate": {
            const editor = window.activeTextEditor
            let languageId = 'Python'
            if (editor) {
              languageId = getDocumentLanguage(editor)
            }
            const { code, dst } = payload
            let result
            try {
              result = await getCodeTranslation(
                code,
                languageId,
                dst,
              )
            } catch (error) {
              result = {
                translation: [],
              };
            }
            console.log('res', result)
            webview.postMessage({
              command: "codegeex.translateResult",
              payload: result.translation[0] || 'No result, please try again',
            });
            return
          }
          case 'codegeex.explain': {
            const editor = window.activeTextEditor
            let languageId = 'Python'
            if (editor) {
              languageId = getDocumentLanguage(editor)
            }
            const { code, locale } = payload
            let result
            try {
              result = await getCodeExplain(
                code,
                languageId,
                locale,
              )
            } catch (error) {
              result = {
                explain: [],
              };
            }
            console.log('res', result)
            webview.postMessage({
              command: "codegeex.explainResult",
              payload: result.explain[0] || 'No result, please try again',
            });
            return
          }
          case 'codegeex.template': {
            const editor = window.activeTextEditor
            let languageId = 'Python'
            if (editor) {
              languageId = getDocumentLanguage(editor)
            }
            const { code } = payload
            let result
            try {
              result = await getCodeCompletions(
                code,
                1,
                languageId,
                apiKey,
                apiSecret,
                "prompt"
              );
            } catch (error) {
              result = {
                explain: [],
              };
            }
            console.log('res', result)
            webview.postMessage({
              command: "codegeex.templateResult",
              payload: result?.completions?.reduce((acc, cur) => acc + cur, '') || 'No result, please try again',
            });
            return
          }
        }
      },
      undefined,
      this._disposables
    );
  }
  public postMessage(message: any) {
    this.webviewView?.webview.postMessage(message);
  }
}

import * as vscode from 'vscode';
import { buttonsData } from './buttons';

export function activate(context: vscode.ExtensionContext) {
  const provider = new ButtonsViewProvider(context.extensionUri);

  context.subscriptions.push(vscode.window.registerWebviewViewProvider(ButtonsViewProvider.viewType, provider));
}

class ButtonsViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'platformio-big-buttons.buttons';

  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(webviewView: vscode.WebviewView, _context: vscode.WebviewViewResolveContext, _token: vscode.CancellationToken) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (message) => {
      buttonsData.forEach(async (buttonData) => {
        if (message.command === buttonData.id) {
          await vscode.commands.executeCommand(buttonData.platformioCommand);
        }
      });
    });
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    // Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
    const webwiewJSUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'dist', 'webview', 'main.js'));

    return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>PlatformIO Big Buttons</title>
      </head>
      <body>
        <div id="buttons_container"></div>
        <script type="module" src="${webwiewJSUri}"></script>
        <style>
          #buttons_container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(42px, 1fr));
            gap: 6px;
            width: 100%;
            max-width: 600px;
            padding-top: 8px;
            padding-bottom: 8px;
          }
    
          .button {
            aspect-ratio: 1 / 1;

            display: flex;
            justify-content: center;
            align-items: center;

            padding: 4px;
          }

          #buttons_container .button .button_icon {
            flex: 1;
            height: 2em;
            width: 2em;
            margin: 0;
          }

          /* Big thanks https://icones.js.org and Antfu! */

          .icon--codicon {
            display: inline-block;
            width: 1em;
            height: 1em;
            background-color: currentColor;
            -webkit-mask-image: var(--svg);
            mask-image: var(--svg);
            -webkit-mask-repeat: no-repeat;
            mask-repeat: no-repeat;
            -webkit-mask-size: 100% 100%;
            mask-size: 100% 100%;
          }

          .icon--codicon--check {
            --svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' width='16' height='16'%3E%3Cpath fill='black' fill-rule='evenodd' d='m14.431 3.323l-8.47 10l-.79-.036l-3.35-4.77l.818-.574l2.978 4.24l8.051-9.506z' clip-rule='evenodd'/%3E%3C/svg%3E");
          }

          .icon--codicon--arrow-right {
            --svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' width='16' height='16'%3E%3Cpath fill='black' fill-rule='evenodd' d='m9 13.887l5-5V8.18l-5-5l-.707.707l4.146 4.147H2v1h10.44L8.292 13.18z' clip-rule='evenodd'/%3E%3C/svg%3E");
          }

          .icon--codicon--vm {
            --svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' width='16' height='16'%3E%3Cpath fill='black' fill-rule='evenodd' d='M14.5 2h-13l-.5.5v10l.5.5H7v1H4v1h8v-1H9v-1h5.5l.5-.5v-10zM14 12H2V3h12z' clip-rule='evenodd'/%3E%3C/svg%3E");
          }

          .icon--codicon--vm-running {
            --svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' width='16' height='16'%3E%3Cg fill='black'%3E%3Cpath fill-rule='evenodd' d='M1.5 2h13l.5.5v5.503a5 5 0 0 0-1-.583V3H2v9h5a5 5 0 0 0 1 3H4v-1h3v-1H1.5l-.5-.5v-10z' clip-rule='evenodd'/%3E%3Cpath d='M12 8q.55 0 1.063.14q.51.141.953.407q.44.265.808.625q.367.36.63.808a4.03 4.03 0 0 1 .405 3.082q-.14.513-.406.954a4.4 4.4 0 0 1-.625.808q-.36.367-.808.63a4.03 4.03 0 0 1-3.082.405a3.8 3.8 0 0 1-.954-.406a4.4 4.4 0 0 1-.808-.625a3.8 3.8 0 0 1-.63-.808a4.03 4.03 0 0 1-.405-3.082q.14-.513.406-.954q.265-.44.625-.808q.36-.367.808-.63A4.03 4.03 0 0 1 12 8m2 3.988L11 10v4z'/%3E%3C/g%3E%3C/svg%3E");
          }
        </style>
      </body>
    </html>`;
  }
}

export function deactivate() {}

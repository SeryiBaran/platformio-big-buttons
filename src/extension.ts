import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
  const provider = new ButtonsViewProvider(context.extensionUri)

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      ButtonsViewProvider.viewType,
      provider,
    ),
  )
}

class ButtonsViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'platformio-big-buttons.buttons'

  private _view?: vscode.WebviewView

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken,
  ) {
    this._view = webviewView

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [this._extensionUri],
    }

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview)

    webviewView.webview.onDidReceiveMessage(async (message) => {
      switch (message.command) {
        case 'build':
          await vscode.commands.executeCommand('platformio-ide.build')
          return
        case 'upload':
          await vscode.commands.executeCommand('platformio-ide.upload')
          return
        case 'serial_monitor':
          await vscode.commands.executeCommand('platformio-ide.serialMonitor')
          return
        case 'upload_and_serial_monitor':
          await vscode.commands.executeCommand(
            'platformio-ide.uploadAndMonitor',
          )
      }
    })
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    // Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
    const webwiewJSUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'out', 'webview.js'),
    )

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
            grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
            gap: 8px;
            width: 100%;
            max-width: 600px;
          }
    
          .button {
            min-height: 100px;
          }
        </style>
      </body>
    </html>`
  }
}

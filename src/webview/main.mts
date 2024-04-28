import { provideVSCodeDesignSystem, vsCodeButton } from '@vscode/webview-ui-toolkit'
import { buttonsData } from '../buttons.js'

provideVSCodeDesignSystem().register(vsCodeButton())

const vscode = acquireVsCodeApi()

window.addEventListener('load', main)

function main() {
  const buttons_container = document.getElementById('buttons_container')

  buttonsData.forEach((button_data) => {
    const new_button = document.createElement('vscode-button')
    new_button.className = 'button'
    new_button.id = button_data.id
    new_button.textContent = button_data.title
    new_button.addEventListener('click', () => {
      vscode.postMessage({
        command: button_data.id,
      })
    })

    if (buttons_container)
      buttons_container.appendChild(new_button)
  })
}

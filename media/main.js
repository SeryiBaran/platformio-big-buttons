(function () {
  const vscode = acquireVsCodeApi()
  const buttons_data = [
    { id: 'build', name: 'Build' },
    { id: 'upload', name: 'Upload' },
    { id: 'serial_monitor', name: 'Open Serial monitor' },
    { id: 'upload_and_serial_monitor', name: 'Upload & Open Serial monitor' },
  ]
  const buttons_container = document.getElementById('buttons_container')

  buttons_data.forEach((button_data) => {
    const new_button = document.createElement('button')
    new_button.className = 'button'
    new_button.id = button_data.id
    new_button.textContent = button_data.name
    new_button.addEventListener('click', () => {
      vscode.postMessage({
        command: button_data.id,
      })
    })

    buttons_container.appendChild(new_button)
  })
})()

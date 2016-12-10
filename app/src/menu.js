const {app, Menu, shell} = require('electron')
const REPO = 'https://github.com/HR/Crypter/'
const REPO_FORK = 'https://github.com/HR/Crypter/fork'
const REPO_DOCS = 'https://github.com/HR/Crypter/blob/master/readme.md'
const REPO_REPORT_ISSUE = 'https://github.com/HR/Crypter/issues/new'
const menu = [
  {
    label: 'Help',
    role: 'help',
    submenu: [
      { label: 'Documentation', click() { shell.openExternal(REPO_DOCS)} },
      { type: 'separator' },
      { label: 'Report Issue', click() { shell.openExternal(REPO_REPORT_ISSUE)} },
      { label: 'Star Crypter', click() { shell.openExternal(REPO)} },
      { label: 'Contribute', click() { shell.openExternal(REPO_FORK)} },
    ]
  }
]

if (process.platform === 'darwin') {
  menu.unshift({
    label: 'Crypter',
    submenu: [
      { label: 'About Crypter', click() { } },
      { label: `Version ${app.getVersion()}`, enabled: false },
      { type: 'separator' },
      { label: 'Preferences…', click() { SettingsWindow(()=>{}) } },
      { type: 'separator' },
      { label: 'Quit', click() { } }
    ]
  })
}

module.exports = menu

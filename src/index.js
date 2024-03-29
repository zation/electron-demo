const { app, BrowserWindow, BrowserView } = require('electron')
const path = require('path')

const cookies = [{"domain":".onlyfans.com","expirationDate":1746288938.804531,"hostOnly":false,"httpOnly":true,"name":"csrf","path":"/","sameSite":"unspecified","secure":true,"session":false,"storeId":"0","value":"FfJ4fAFWfce5012c1d1ed5b50365b535747790a7"},{"domain":".onlyfans.com","expirationDate":1739885734.7431,"hostOnly":false,"httpOnly":false,"name":"cookiesAccepted","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"all"},{"domain":".onlyfans.com","expirationDate":1743264938,"hostOnly":false,"httpOnly":false,"name":"fp","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"c4a9c1fd09219e05c9837761f6d7306640d2507f"},{"domain":".onlyfans.com","expirationDate":1746288939.121821,"hostOnly":false,"httpOnly":false,"name":"lang","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"en"},{"domain":".onlyfans.com","expirationDate":1746284497.639474,"hostOnly":false,"httpOnly":true,"name":"auth_id","path":"/","sameSite":"unspecified","secure":true,"session":false,"storeId":"0","value":"391014227"},{"domain":".onlyfans.com","expirationDate":1712592937.494287,"hostOnly":false,"httpOnly":true,"name":"sess","path":"/","sameSite":"unspecified","secure":true,"session":false,"storeId":"0","value":"nm1i08k5q2lseh017075gjrr3f"},{"domain":".onlyfans.com","expirationDate":1743264939,"hostOnly":false,"httpOnly":false,"name":"ref_src","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"https%3A%2F%2Faccounts.google.com%2F"},{"domain":".onlyfans.com","expirationDate":1746288940.166147,"hostOnly":false,"httpOnly":false,"name":"st","path":"/","sameSite":"unspecified","secure":true,"session":false,"storeId":"0","value":"05fb3957b926fa179b713dfc1a5edbe2f67e1da9a6ee9f1813b389964b256053"}]
const cookiesObject = cookies.reduce((a,b) => { return {...a, [b.name]:b.value} }, {})
console.log(cookiesObject)

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit()
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1800,
    height: 1200,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true,
    },
  })

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'))

  const view = new BrowserView()
  mainWindow.setBrowserView(view)
  view.setBounds({ x: 0, y: 0, width: 1600, height: 1200 })

  cookies.forEach((cookie) => {
    view.webContents.session.cookies.set({
      url: 'https://onlyfans.com',
      path: cookie.path,
      domain: cookie.domain,
      value: cookie.value,
      name: cookie.name,
      httpOnly: cookie.httpOnly,
      secure: cookie.secure,
      sameSite: 'unspecified',
    })
  })
  view.webContents.openDevTools()
  view.webContents.loadURL('https://onlyfans.com/', {
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
  })
  view.webContents.executeJavaScript(`localStorage.setItem('bcTokenSha', '${cookies.find(({ name }) => name === 'fp').value}')`)

  // Open the DevTools.
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  createWindow()
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

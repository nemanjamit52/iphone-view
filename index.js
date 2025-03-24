const { app, BrowserWindow, ipcMain } = require("electron");

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 900,
    transparent: true,
    frame: false,
    resizable: false,
    backgroundColor: "#00000000",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: false,
      webSecurity: false,
    },
  });

  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": ["default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; frame-src *"],
      },
    });
  });

  const aspectRatio = 4 / 9;

  mainWindow.on("resize", () => {
    let [width, height] = mainWindow.getSize();

    if (isNaN(width) || isNaN(height)) {
      console.error("Invalid dimensions received:", width, height);
      return;
    }

    if (width / aspectRatio > height) {
      height = width / aspectRatio;
    } else {
      width = height * aspectRatio;
    }

    if (!isNaN(width) && !isNaN(height)) {
      mainWindow.setSize(Math.round(width), Math.round(height));
    }
  });

  mainWindow.loadFile("index.html");
  // mainWindow.webContents.openDevTools();

  ipcMain.on("close-app", () => {
    console.log("close");
    app.quit();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

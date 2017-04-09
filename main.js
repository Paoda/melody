const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

//Global Reference of Window so it doesn't get garbaged.
let win;

function createWindow() {
    //create browser window
    win = new BrowserWindow({width: 500, height: 500});

    //load index.html
    win.loadURL(url.format({
	pathname: path.join(__dirname, 'index.html'),
	protocol: 'file:',
	slashes: true
    }));

    //Open DevTools
    win.webContents.openDevTools();

    win.on('closed', () => {
	win = null;
    });
}

app.on('ready', createWindow);


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin'); {
	app.quit();
    }
});

app.on('activate', () => {
    if (win == null) {
	createWindow();
    }
});

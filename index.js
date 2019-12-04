const electron = require('electron');
const path = require('path');
const {app, BrowserWindow} = electron;

global.sharedObject = {}

app.on('ready', () => {
	const screenElectron = electron.screen.getPrimaryDisplay();
	const optimalWidth = screenElectron.size.width * 9/10;
	const optimalHeight = screenElectron.size.height * 9/10;

	const win = new BrowserWindow(
		{
			backgroundColor: '#ffffff',
			width: 1240,
			minWidth: 1240,
			height: 800,
			minHeight: 800,
			center: true,
			transparent: true,
			frame: false,
			icon: path.join(__dirname, './dist/icons/128x128.png'),
			webPreferences: {
				nodeIntegration: true
			}
		}
	);
	win.loadURL('file://' + __dirname + "/dist/index.html");
})

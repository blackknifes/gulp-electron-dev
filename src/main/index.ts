import { app, remote, BrowserWindow } from "electron";

let mainWindow: BrowserWindow;

app.on("ready", ()=>{
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 800,
        backgroundColor: "#FFFFFF",
        show: false,
        webPreferences:
        {
            plugins: true
        }
    });

    mainWindow.loadFile("./app/index.html");
    mainWindow.once("ready-to-show", ()=>{
        mainWindow.show();
    });
});

app.on("window-all-closed", ()=>{
    app.quit();
});
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  // we can also expose variables, not just functions
})

contextBridge.exposeInMainWorld('electronAPI',{
  requestDataFile: (filePath) => ipcRenderer.send('request-data-file', filePath)
  , handleProcessCnt: (curr, total) => ipcRenderer.on('update-counter', curr, total)
  , handleEndProcess: (callback) => ipcRenderer.on('end-process', callback)
})
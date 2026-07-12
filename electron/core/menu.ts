import { app, Menu, BrowserWindow, dialog } from 'electron';

export function buildAppMenu(): Menu {
  const isMac = process.platform === 'darwin';

  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: isMac ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => app.quit(),
        },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo', label: 'Undo' },
        { role: 'redo', label: 'Redo' },
        { type: 'separator' },
        { role: 'cut', label: 'Cut' },
        { role: 'copy', label: 'Copy' },
        { role: 'paste', label: 'Paste' },
        { type: 'separator' },
        { role: 'selectAll', label: 'Select All' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload', label: 'Reload' },
        { role: 'toggleDevTools', label: 'Toggle Developer Tools' },
        { type: 'separator' },
        { role: 'zoomIn', label: 'Zoom In' },
        { role: 'zoomOut', label: 'Zoom Out' },
        { role: 'resetZoom', label: 'Reset Zoom' },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About iMooDesktop',
          click: () => {
            dialog.showMessageBox({
              type: 'info',
              title: 'About iMooDesktop',
              message: `iMooDesktop v${app.getVersion()}`,
              detail:
                'iMooDesktop - XTC 电话手表工具箱\n' +
                '基于 AllToolBox 1.3.8fix1 业务逻辑独立重写\n' +
                `Copyright (C) 2026 J1ao`,
            });
          },
        },
      ],
    },
  ];

  return Menu.buildFromTemplate(template);
}

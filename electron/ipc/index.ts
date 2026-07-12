import { registerAppIpc } from './app';
import { registerBackupIpc } from './backup';
import { registerCloudIpc } from './cloud';
import { registerDeviceIpc } from './device';
import { registerEdlPartitionIpc } from './edlPartition';
import { registerFileIpc } from './file';
import { registerLogIpc } from './log';
import { registerMagiskIpc } from './magisk';
import { registerRebootIpc } from './reboot';
import { registerRootIpc } from './root';
import { registerScrcpyIpc } from './scrcpy';
import { registerSystemIpc } from './system';
import { registerToolsIpc } from './tools';
import { registerAgentIpc } from './agent';

export function registerAllIpc(): void {
  registerAppIpc();
  registerBackupIpc();
  registerCloudIpc();
  registerDeviceIpc();
  registerEdlPartitionIpc();
  registerFileIpc();
  registerLogIpc();
  registerMagiskIpc();
  registerRebootIpc();
  registerRootIpc();
  registerScrcpyIpc();
  registerSystemIpc();
  registerToolsIpc();
  registerAgentIpc();
}

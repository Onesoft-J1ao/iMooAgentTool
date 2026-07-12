import {
  Smartphone,
  RefreshCw,
  Cloud,
  Grid,
  File,
  HardDrive,
  Wrench,
  Shield,
  Database,
  Settings,
  Terminal,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
  category: string;
}

export const menuItems: MenuItem[] = [
  { id: 'home', label: '主页', icon: Smartphone, path: '/', category: '设备工具' },
  { id: 'reboot', label: '重启模式', icon: RefreshCw, path: '/reboot', category: '设备工具' },
  { id: 'cloud', label: '资源管理', icon: Cloud, path: '/cloud', category: '设备工具' },
  { id: 'root', label: 'Root 工具', icon: Shield, path: '/root', category: '设备工具' },
  { id: 'files', label: '文件管理', icon: File, path: '/files', category: '文件管理' },
  { id: 'apps', label: '应用管理', icon: Grid, path: '/apps', category: '文件管理' },
  { id: 'tools', label: '工具箱', icon: Wrench, path: '/tools', category: '系统工具' },
  { id: 'magisk', label: 'Magisk', icon: Database, path: '/magisk', category: '系统工具' },
  { id: 'backup', label: '备份恢复', icon: HardDrive, path: '/backup', category: '系统工具' },
  { id: 'edl-partitions', label: 'EDL 分区', icon: Terminal, path: '/edl-partitions', category: '其他' },
  { id: 'settings', label: '设置', icon: Settings, path: '/settings', category: '其他' },
  { id: 'logs', label: '日志', icon: Terminal, path: '/logs', category: '其他' },
];

export const categories = ['设备工具', '文件管理', '系统工具', '其他'] as const;

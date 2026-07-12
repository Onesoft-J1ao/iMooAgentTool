import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { SplashScreen } from '@/components/common/SplashScreen';
import { DisclaimerModal } from '@/components/common/DisclaimerModal';
import { EulaModal } from '@/components/common/EulaModal';
import { Toaster } from '@/components/common/Toaster';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import AppErrorBoundary from '@/components/common/AppErrorBoundary';
import AgentButton from '@/components/Agent/AgentButton';
import AgentPanel from '@/components/Agent/AgentPanel';
import { useSettingsStore } from '@/stores/settingsStore';
import { useDeviceStore } from '@/stores/deviceStore';
import { api } from '@/lib/api';
import Home from '@/routes/Home';
import Reboot from '@/routes/Reboot';
import Cloud from '@/routes/Cloud';
import Apps from '@/routes/Apps';
import Files from '@/routes/Files';
import EdlPartitions from '@/routes/EdlPartitions';
import Tools from '@/routes/Tools';
import Magisk from '@/routes/Magisk';
import Backup from '@/routes/Backup';
import Root from '@/routes/Root';
import Settings from '@/routes/Settings';
import Logs from '@/routes/Logs';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showEula, setShowEula] = useState(false);
  const loadSettings = useSettingsStore((s) => s.load);
  const setDevice = useDeviceStore((s) => s.setDevice);

  useEffect(() => {
    const init = async () => {
      await loadSettings();
      const settings = useSettingsStore.getState().settings;
      if (settings.showDisclaimerOnStart) {
        setShowDisclaimer(true);
      } else {
        setShowEula(false);
      }
      api.device.current().then(setDevice).catch(() => {});
      const splashTimer = setTimeout(() => setShowSplash(false), 1500);
      return () => clearTimeout(splashTimer);
    };
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDisclaimerAccept = async () => {
    setShowDisclaimer(false);
    setShowEula(true);
  };

  const handleEulaAccept = async () => {
    setShowEula(false);
    await useSettingsStore.getState().update({ showDisclaimerOnStart: false });
  };

  if (showSplash) {
    return <SplashScreen message="正在初始化..." />;
  }

  return (
    <AppErrorBoundary>
      <Toaster>
        {showDisclaimer && (
          <DisclaimerModal
            onAccept={handleDisclaimerAccept}
            onDecline={() => window.close()}
          />
        )}
        {showEula && (
          <EulaModal
            onAccept={handleEulaAccept}
            onDecline={() => window.close()}
          />
        )}
        <AppShell>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/reboot" element={<Reboot />} />
              <Route path="/cloud" element={<Cloud />} />
              <Route path="/apps" element={<Apps />} />
              <Route path="/files" element={<Files />} />
              <Route path="/edl-partitions" element={<EdlPartitions />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/magisk" element={<Magisk />} />
              <Route path="/backup" element={<Backup />} />
              <Route path="/root" element={<Root />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/logs" element={<Logs />} />
            </Routes>
          </ErrorBoundary>
        </AppShell>
        <AgentButton />
        <AgentPanel />
      </Toaster>
    </AppErrorBoundary>
  );
}

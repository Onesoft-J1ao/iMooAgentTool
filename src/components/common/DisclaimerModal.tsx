import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

interface DisclaimerModalProps {
  onAccept: () => void;
  onDecline?: () => void;
}

export function DisclaimerModal({ onAccept, onDecline }: DisclaimerModalProps) {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-xl">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <AlertTriangle size={22} className="text-yellow-400" />
            </div>
            <h2 className="text-lg font-bold text-white">免责声明</h2>
          </div>

          <div className="bg-slate-900/50 rounded-lg p-4 mb-4 max-h-64 overflow-y-auto scrollbar-thin text-sm text-slate-300 leading-relaxed space-y-3">
            <p>
              本软件 (iMooAgentTool) 是一款用于 XTC 电话手表的工具箱软件，由社区开发者提供。
              使用本软件可能对设备进行系统级操作，包括但不限于获取 Root 权限、修改系统分区、
              刷写固件等操作。
            </p>
            <p>
              <strong className="text-yellow-400">重要提示：</strong>
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>使用本软件可能导致设备保修失效</li>
              <li>操作不当可能导致设备变砖、数据丢失</li>
              <li>请确保您已备份重要数据</li>
              <li>请确保设备电量充足（建议 50% 以上）</li>
              <li>请自行承担操作风险</li>
            </ul>
            <p>
              继续使用本软件即表示您已阅读、理解并同意以上条款。
              作者及贡献者对因使用本软件造成的任何损失概不负责。
            </p>
          </div>

          <label className="flex items-center gap-2 cursor-pointer mb-4">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-300">我已阅读并同意以上声明，愿自行承担所有风险</span>
          </label>

          <div className="flex gap-3 justify-end">
            {onDecline && (
              <button onClick={onDecline} className="btn-secondary">
                退出
              </button>
            )}
            <button onClick={onAccept} disabled={!accepted} className="btn-primary">
              同意并继续
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { FileText } from 'lucide-react';

interface EulaModalProps {
  onAccept: () => void;
  onDecline?: () => void;
}

export function EulaModal({ onAccept, onDecline }: EulaModalProps) {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-xl">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <FileText size={22} className="text-blue-400" />
            </div>
            <h2 className="text-lg font-bold text-white">最终用户许可协议</h2>
          </div>

          <div className="bg-slate-900/50 rounded-lg p-4 mb-4 max-h-64 overflow-y-auto scrollbar-thin text-sm text-slate-300 leading-relaxed space-y-3">
            <p><strong>iMooAgentTool 最终用户许可协议 (EULA)</strong></p>
            <p>版本 1.0 | 最后更新: 2026-06-18</p>

            <p><strong>1. 许可授予</strong></p>
            <p>
              本软件基于 GPL-3.0 开源协议发布。您可以自由使用、修改和分发本软件，
              但必须遵守 GPL-3.0 协议的相关条款。
            </p>

            <p><strong>2. 免责条款</strong></p>
            <p>
              本软件按"现状"提供，不提供任何明示或暗示的担保。
              在适用法律允许的最大范围内，作者不对因使用或无法使用本软件所造成的任何损害承担责任。
            </p>

            <p><strong>3. 使用限制</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>禁止将本软件用于非法目的</li>
              <li>禁止移除或修改本软件的版权声明</li>
              <li>禁止将本软件用于任何侵犯第三方权益的行为</li>
            </ul>

            <p><strong>4. 知识产权</strong></p>
            <p>
              本软件及其所有相关组件的知识产权归原作者所有。
              本协议不授予任何商标或版权所有权。
            </p>
          </div>

          <label className="flex items-center gap-2 cursor-pointer mb-4">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-300">我已阅读并同意本许可协议</span>
          </label>

          <div className="flex gap-3 justify-end">
            {onDecline && (
              <button onClick={onDecline} className="btn-secondary">
                拒绝
              </button>
            )}
            <button onClick={onAccept} disabled={!accepted} className="btn-primary">
              同意
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

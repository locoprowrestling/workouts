import { useRef, useState } from 'react';
import { X, Download, Upload, Copy, Check, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { downloadBackup, generateBackupCode, parseBackup, readFileAsText } from '../../lib/sync';

interface Props {
  onClose: () => void;
}

type Status = { kind: 'idle' } | { kind: 'success'; msg: string } | { kind: 'error'; msg: string };

export default function SyncModal({ onClose }: Props) {
  const { state, importStorage } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [backupCode, setBackupCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [confirmImport, setConfirmImport] = useState<{ data: ReturnType<typeof parseBackup> } | null>(null);

  function handleDownload() {
    downloadBackup(state);
    setStatus({ kind: 'success', msg: 'Backup file downloaded.' });
  }

  function handleCopyCode() {
    const code = generateBackupCode(state);
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await readFileAsText(file);
      const data = parseBackup(text);
      if (!data) {
        setStatus({ kind: 'error', msg: 'Invalid backup file. Make sure you picked the right file.' });
        return;
      }
      setConfirmImport({ data });
    } catch {
      setStatus({ kind: 'error', msg: 'Could not read the file.' });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  function handleRestoreCode() {
    const data = parseBackup(backupCode);
    if (!data) {
      setStatus({ kind: 'error', msg: 'Invalid backup code. Copy it exactly from the other device.' });
      return;
    }
    setConfirmImport({ data });
  }

  function confirmRestore() {
    if (!confirmImport?.data) return;
    importStorage(confirmImport.data);
    setConfirmImport(null);
    setBackupCode('');
    setStatus({ kind: 'success', msg: 'Progress restored successfully!' });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70" onClick={onClose}>
      <div
        className="w-full max-w-sm bg-gray-900 rounded-t-3xl p-6 pb-8 flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-extrabold text-white">Backup & Sync</div>
            <div className="text-xs text-gray-500 mt-0.5">Save your progress or restore it on another device</div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 p-1">
            <X size={20} />
          </button>
        </div>

        {/* Status banner */}
        {status.kind !== 'idle' && (
          <div className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${
            status.kind === 'success' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'
          }`}>
            <AlertCircle size={16} />
            {status.msg}
          </div>
        )}

        {/* Confirm import dialog */}
        {confirmImport && (
          <div className="bg-amber-950 border border-amber-700 rounded-2xl p-4 flex flex-col gap-3">
            <div className="text-sm font-bold text-amber-300">Replace your current progress?</div>
            <div className="text-xs text-amber-400">
              This will overwrite all your current data with the backup. This cannot be undone.
            </div>
            <div className="flex gap-2">
              <button
                onClick={confirmRestore}
                className="flex-1 bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 rounded-xl text-sm transition-colors"
              >
                Yes, restore
              </button>
              <button
                onClick={() => setConfirmImport(null)}
                className="flex-1 bg-gray-800 text-gray-300 font-bold py-2 rounded-xl text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Export section */}
        <div className="flex flex-col gap-2">
          <div className="text-xs font-bold text-gray-500 tracking-widest">SAVE YOUR PROGRESS</div>
          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-700 hover:bg-indigo-600 text-white font-bold py-3 rounded-xl text-sm transition-colors"
            >
              <Download size={16} />
              Download Backup
            </button>
            <button
              onClick={handleCopyCode}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-xl text-sm transition-colors"
            >
              {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
          </div>
          <div className="text-xs text-gray-600">
            Download a file or copy a code — then restore it on any other device.
          </div>
        </div>

        {/* Import section */}
        <div className="flex flex-col gap-2">
          <div className="text-xs font-bold text-gray-500 tracking-widest">RESTORE FROM BACKUP</div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-xl text-sm transition-colors"
          >
            <Upload size={16} />
            Upload Backup File
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="flex flex-col gap-1.5">
            <textarea
              value={backupCode}
              onChange={(e) => { setBackupCode(e.target.value); setStatus({ kind: 'idle' }); }}
              placeholder="Paste backup code here…"
              rows={3}
              className="w-full bg-gray-800 text-gray-200 text-xs font-mono rounded-xl px-3 py-2.5 resize-none outline-none border border-gray-700 focus:border-indigo-600 placeholder-gray-600"
            />
            <button
              onClick={handleRestoreCode}
              disabled={!backupCode.trim()}
              className="w-full bg-gray-800 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
            >
              Restore from Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

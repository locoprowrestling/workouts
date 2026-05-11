import type { AppStorage } from '../types';

function isValidStorage(data: unknown): data is AppStorage {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;
  return (
    'profile' in d &&
    'sessions' in d &&
    'quests' in d &&
    'lastQuestResetDate' in d &&
    'completedQuestCount' in d
  );
}

export function downloadBackup(data: AppStorage): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `workout-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function generateBackupCode(data: AppStorage): string {
  return btoa(encodeURIComponent(JSON.stringify(data)));
}

export function parseBackup(input: string): AppStorage | null {
  const trimmed = input.trim();
  // Try base64 backup code first
  try {
    const decoded = decodeURIComponent(atob(trimmed));
    const parsed = JSON.parse(decoded);
    if (isValidStorage(parsed)) return parsed;
  } catch {}
  // Try raw JSON
  try {
    const parsed = JSON.parse(trimmed);
    if (isValidStorage(parsed)) return parsed;
  } catch {}
  return null;
}

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

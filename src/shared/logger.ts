export function log(level: 'info' | 'error', message: string, meta?: any) {
  if (level === 'info') {
    console.log(`[INFO] ${message}`, meta || '');
  } else {
    console.error(`[ERROR] ${message}`, meta || '');
  }
}

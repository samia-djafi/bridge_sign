export interface LogEntry {
  id: string;
  timestamp: number;
  level: 'info' | 'warn' | 'error';
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

class DiagnosticLogger {
  private logs: LogEntry[] = [];
  private readonly maxLogs = 50;
  private listeners: ((logs: LogEntry[]) => void)[] = [];

  log(level: 'info' | 'warn' | 'error', message: string, code?: string, details?: Record<string, unknown>) {
    const entry: LogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      level,
      message,
      code,
      details,
    };

    this.logs.unshift(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }

    this.notify();

    if (level === 'error') {
      console.error(`[LSA-LOG] ${message}`, details || '');
    } else if (level === 'warn') {
      console.warn(`[LSA-LOG] ${message}`, details || '');
    } else {
      console.log(`[LSA-LOG] ${message}`, details || '');
    }
  }

  info(message: string, details?: Record<string, unknown>) {
    this.log('info', message, undefined, details);
  }

  warn(message: string, code?: string, details?: Record<string, unknown>) {
    this.log('warn', message, code, details);
  }

  error(message: string, code?: string, details?: Record<string, unknown>) {
    this.log('error', message, code, details);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clear() {
    this.logs = [];
    this.notify();
  }

  subscribe(listener: (logs: LogEntry[]) => void): () => void {
    this.listeners.push(listener);
    listener([...this.logs]);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    for (const listener of this.listeners) {
      listener([...this.logs]);
    }
  }

  exportAsJson(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const logger = new DiagnosticLogger();

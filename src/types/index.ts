export interface LogEntry {
  id: string;
  timestamp: string;
  type: 'info' | 'stdout' | 'stderr' | 'pip' | 'success' | 'warn' | 'system';
  text: string;
  botId?: string;
}

export interface BotInstance {
  id: string;
  name: string;
  description: string;
  status: 'running' | 'stopped' | 'installing' | 'error';
  uptimeSeconds: number;
  ramUsageMb: number;
  cpuPercent: number;
  pid: number;
  files: {
    'bot.py': string;
    'requirements.txt': string;
    '.env': string;
    [key: string]: string;
  };
  envVars: Record<string, string>;
  createdAt: string;
  lastStartedAt?: string;
  lastError?: string;
}

export interface SystemMetrics {
  totalRamMb: number;
  usedRamMb: number;
  freeRamMb: number;
  botTotalRamMb: number;
  cpuPercent: number;
  storageTotalGb: number;
  storageUsedGb: number;
  batteryLevel: number;
  isCharging: boolean;
  isBatteryOptimizedIgnored: boolean;
  isWakeLockActive: boolean;
  isForegroundServiceRunning: boolean;
  isPowerSavingMode: boolean;
  isAutoRamCleanupEnabled: boolean;
}

export interface AndroidProjectFile {
  path: string;
  content: string;
  language: string;
  description: string;
}

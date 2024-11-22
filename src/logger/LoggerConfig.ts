// src/logger/LoggerConfig.ts
export interface LoggerConfig {
    logsDir?: string;
    rotation?: "daily" | "monthly" | "yearly";
    development?: boolean;
  }
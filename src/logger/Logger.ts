// src/logger/Logger.ts
import chalk, { Chalk } from "chalk";
import fsExtra from "fs-extra";
import path from "path";
import { LogLevel } from "./LogLevel";
import { LoggerConfig } from "./LoggerConfig";
import { logToFile } from "./LogToFile";
import { formatTimestamp } from "./FormatTimestamp";

class Logger {
  private static instance: Logger;
  private logsDir: string;
  private rotation: "daily" | "monthly" | "yearly" = "daily";
  private development: boolean = false;
  private chalkInstance: Chalk;

  private levels: {
    [key in LogLevel]: {
      color: string;
      includeTimestampInConsole: boolean;
      defaultLogToFile: boolean;
      logFileName?: string;
    };
  } = {
    info: {
      color: "blue",
      includeTimestampInConsole: false,
      defaultLogToFile: true,
      logFileName: "info.log",
    },
    warn: {
      color: "yellowBright",
      includeTimestampInConsole: false,
      defaultLogToFile: true,
      logFileName: "warn.log",
    },
    error: {
      color: "redBright",
      includeTimestampInConsole: false,
      defaultLogToFile: true,
      logFileName: "error.log",
    },
    verbose: {
      color: "gray",
      includeTimestampInConsole: false,
      defaultLogToFile: true,
      logFileName: "verbose.log",
    },
  };

  private constructor() {
    this.logsDir = path.resolve(process.cwd(), "logs");
    this.chalkInstance = new chalk.Instance();
    fsExtra.ensureDirSync(this.logsDir);
  }

  public static getInstance(): Logger {
    if (!Logger.instance) Logger.instance = new Logger();
    return Logger.instance;
  }

  public setConfig(config: LoggerConfig): void {
    this.logsDir = config.logsDir || this.logsDir;
    this.rotation = config.rotation || this.rotation;
    this.development = config.development || false;
    fsExtra.ensureDirSync(this.logsDir);
  }

  public addLogLevel(
    name: string,
    {
      color,
      includeTimestampInConsole,
      logToFile,
      logFileName,
    }: {
      color: string;
      includeTimestampInConsole: boolean;
      logToFile: boolean;
      logFileName?: string;
    }
  ): void {
    // @ts-ignore
    if (this.levels[name])
      throw new Error(`Log level: "${name}" already exists.`);

    // @ts-ignore
    this.levels[name] = {
      color,
      includeTimestampInConsole,
      defaultLogToFile: logToFile,
      logFileName,
    };

    if (logFileName) {
      fsExtra.ensureFileSync(path.resolve(this.logsDir, logFileName));
    }
  }

  public log(
    level: string,
    message: any,
    optionsOverride: {
      includeTimestampInConsole?: boolean;
      logToFile?: boolean;
      color?: string;
    } = {}
  ): void {
    try {
      // @ts-ignore
      const levelOptions = this.levels[level] || {};
      const options = { ...levelOptions, ...optionsOverride };

      // Check if the message is an object, but not an Error object
      if (typeof message === "object" && !(message instanceof Error)) {
        message = JSON.stringify(message, null, 2);
      }

      const now = new Date();
      const logMessage = `${
        options.includeTimestampInConsole ? formatTimestamp(now) : ""
      } ${message}`;

      if (this.development) {
        console.log(
          // @ts-ignore
          `[${chalk[options.color || levelOptions.color](
            level.toUpperCase()
          )}] - ${logMessage}`
        );
      }

      if (options.logToFile || levelOptions.defaultLogToFile) {
        logToFile(this.logsDir, this.rotation, level, logMessage);
      }
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error(`Log level: "${level}" is not defined.`);
      } else {
        throw error;
      }
    }
  }

  public info(
    message: string,
    optionsOverride: {
      includeTimestampInConsole?: boolean;
      logToFile?: boolean;
      color?: string;
    } = {}
  ): void {
    this.log("info", message, optionsOverride);
  }

  public warn(
    message: string,
    optionsOverride: {
      includeTimestampInConsole?: boolean;
      logToFile?: boolean;
      color?: string;
    } = {}
  ): void {
    this.log("warn", message, optionsOverride);
  }

  public error(
    message: string,
    optionsOverride: {
      includeTimestampInConsole?: boolean;
      logToFile?: boolean;
      color?: string;
    } = {}
  ): void {
    this.log("error", message, optionsOverride);
  }
}

export default Logger.getInstance();

import chalk, { Color } from "chalk";
import fsExtra from "fs-extra";
import path from "path";

/**
 * Logger class implementing Singleton pattern for logging with different levels.
 */
class Logger {
  private static instance: Logger;
  private logsDir: string;
  private rotation: "daily" | "monthly" | "yearly" = "daily";
  private development: boolean = false; // This controls whether to log to the console or not

  /**
   * Default log levels with their configurations.
   */
  private levels: {
    [key in LogLevel]: {
      color: typeof Color;
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
    verb: {
      color: "gray",
      includeTimestampInConsole: false,
      defaultLogToFile: true,
      logFileName: "verbose.log",
    },
  };

  /**
   * Private constructor to prevent direct instantiation.
   */
  private constructor() {
    this.logsDir = path.resolve(process.cwd(), "logs"); // Set the default logs directory
    fsExtra.ensureDirSync(this.logsDir);
  }

  /**
   * Public method to set the configuration for the logger.
   */
  public setConfig = (config: {
    logsDir?: string;
    rotation?: "daily" | "monthly" | "yearly";
    development?: boolean;
  }) => {
    this.logsDir = config.logsDir || this.logsDir;
    this.rotation = config.rotation || this.rotation;
    this.development = config.development || false;
    fsExtra.ensureDirSync(this.logsDir);
  };

  /**
   * Private method to format dates
   */
  private formatTimestamp(date: Date): string {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
    const day = date.getDate().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds} - ${year}/${month}/${day}`;
  }

  /**
   * Get the singleton instance of the Logger.
   * @returns {Logger} The singleton instance of the Logger.
   */
  public static getInstance(): Logger {
    if (!Logger.instance) Logger.instance = new Logger();
    return Logger.instance;
  }

  /**
   * Add a new log level.
   * @param {Object} params - The parameters for the new log level.
   * @param {LogLevel} params.level - The name of the log level.
   * @param {string} params.color - The color associated with the log level.
   * @param {boolean} params.includeTimestamp - Whether to include a timestamp in the log.
   * @param {boolean} params.logToFile - Whether to log to a file.
   * @param {string} [params.logFile] - The file to log to, if applicable.
   * @throws {Error} If the log level already exists.
   */
  public addLogLevel = (
    name: string,
    {
      color,
      includeTimestampInConsole,
      logToFile,
      logFileName,
    }: {
      color: typeof Color;
      includeTimestampInConsole: boolean;
      logToFile: boolean;
      logFileName?: string;
    }
  ) => {
    // @ts-ignore
    if (this.levels[name])
      throw new Error(`Log level: "${name}" already exists.`);

    // @ts-ignore
    this.levels[name] = {
      color,
      includeTimestampInConsole: includeTimestampInConsole,
      defaultLogToFile: logToFile,
      logFileName: logFileName,
    };
  };

  /**
   * Private method to log to file given the rotation.
   */
  private logToFile = (level: string, message: string) => {
    const now = new Date();

    if (this.rotation === "daily") {
      // Create folders for year, month and day
      const yearDir = path.resolve(this.logsDir, now.getFullYear().toString());
      fsExtra.ensureDirSync(yearDir);
      const monthDir = path.resolve(yearDir, (now.getMonth() + 1).toString());
      fsExtra.ensureDirSync(monthDir);
      const dayDir = path.resolve(monthDir, now.getDate().toString());
      fsExtra.ensureDirSync(dayDir);

      const logFile = path.resolve(dayDir, `${level}.log`);
      fsExtra.appendFileSync(logFile, `${message}`); // Date will always be included in the file
    }

    if (this.rotation === "monthly") {
      // Create folder for year and month
      const yearDir = path.resolve(this.logsDir, now.getFullYear().toString());
      fsExtra.ensureDirSync(yearDir);
      const monthDir = path.resolve(yearDir, (now.getMonth() + 1).toString());
      fsExtra.ensureDirSync(monthDir);

      const logFile = path.resolve(monthDir, `${level}.log`);
      fsExtra.appendFileSync(logFile, `${message}`); // Date will always be included in the file
    }

    if (this.rotation === "yearly") {
      // Create folder for year
      const yearDir = path.resolve(this.logsDir, now.getFullYear().toString());
      fsExtra.ensureDirSync(yearDir);

      const logFile = path.resolve(yearDir, `${level}.log`);
      fsExtra.appendFileSync(logFile, `${message}`); // Date will always be included in the file
    }
  };

  /**
   * Log a message at a specified log level.
   * @param {string} level - The log level to use.
   * @param {string} message - The message to log.
   * @param {Object} [optionsOverride] - Optional overrides for the log options.
   * @param {boolean} [optionsOverride.includeTimestamp] - Whether to include a timestamp in the log.
   * @param {boolean} [optionsOverride.logToFile] - Whether to log to a file.
   * @param {string} [optionsOverride.color] - The color to use for the log message.
   */
  public log = (
    level: string,
    message: any,
    optionsOverride: {
      includeTimestampInConsole?: boolean;
      logToFile?: boolean;
      color?: typeof Color;
    } = {}
  ): void => {
    try {
      // @ts-ignore
      const levelOptions = this.levels[level] || {};
      const options = { ...levelOptions, ...optionsOverride };

      const now = new Date();
      const logMessage = `${
        options.includeTimestampInConsole ? this.formatTimestamp(now) : ""
      } ${message}`;

      // Log to the console
      if (this.development) {
        console.log(
          // @ts-ignore
          `[${chalk[options.color || levelOptions.color](
            level.toUpperCase()
          )}] - ${logMessage}`
        );
      }

      // Log to the file
      if (options.logToFile || levelOptions.defaultLogToFile) {
        this.logToFile(level, `${this.formatTimestamp(now)} ${message}\n`);
      }
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error(`Log level: "${level}" is not defined.`);
      } else {
        throw error; // Re-throw the error if it's not the expected type
      }
    }
  };

  // Legacy methods
  public info = (
    message: string,
    optionsOverride: {
      includeTimestampInConsole?: boolean;
      logToFile?: boolean;
      color?: typeof Color;
    } = {}
  ) => this.log("info", message, optionsOverride);
  public warn = (
    message: string,
    optionsOverride: {
      includeTimestampInConsole?: boolean;
      logToFile?: boolean;
      color?: typeof Color;
    } = {}
  ) => this.log("warn", message, optionsOverride);
  public error = (
    message: string,
    optionsOverride: {
      includeTimestampInConsole?: boolean;
      logToFile?: boolean;
      color?: typeof Color;
    } = {}
  ) => this.log("error", message, optionsOverride);
}

type LogLevel = "info" | "warn" | "error" | "verb";

export default Logger.getInstance();

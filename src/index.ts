import chalk, { Chalk, Color } from "chalk";
import fsExtra from "fs-extra";
import path from "path";

/**
 * Logger class implementing Singleton pattern for logging with different levels.
 */
class Logger {
  private static instance: Logger;
  private logsDir: string;
  private chalkInstance: Chalk;

  /**
   * Default log levels with their configurations.
   */
  private levels: {
    [key in LogLevel]: {
      color: typeof Color;
      includeTimestamp: boolean;
      defaultLogToFile: boolean;
      logFile?: string;
    };
  } = {
    info: {
      color: "blue",
      includeTimestamp: false,
      defaultLogToFile: true,
      logFile: "info.log",
    },
    warn: {
      color: "yellowBright",
      includeTimestamp: false,
      defaultLogToFile: true,
      logFile: "warn.log",
    },
    error: {
      color: "redBright",
      includeTimestamp: false,
      defaultLogToFile: true,
      logFile: "error.log",
    },
    verb: {
      color: "gray",
      includeTimestamp: false,
      defaultLogToFile: true,
      logFile: "verbose.log",
    },
  };

  /**
   * Private constructor to prevent direct instantiation.
   */
  private constructor() {
    this.logsDir = path.resolve(process.cwd(), "logs"); // Set the default logs directory
    this.chalkInstance = new chalk.Instance();
    fsExtra.ensureDirSync(this.logsDir);
    Object.keys(this.levels).forEach((level) => {
      const { logFile } = this.levels[level as LogLevel];
      if (logFile) {
        fsExtra.ensureFileSync(path.resolve(this.logsDir, logFile));
      }
    });
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
  public addLogLevel = ({
    level,
    color,
    includeTimestamp,
    logToFile,
    logFile,
  }: {
    level: LogLevel;
    color: typeof Color;
    includeTimestamp: boolean;
    logToFile: boolean;
    logFile?: string;
  }) => {
    if (this.levels[level])
      throw new Error(`Log level: "${level}" already exists.`);

    this.levels[level] = {
      color,
      includeTimestamp,
      defaultLogToFile: logToFile,
      logFile,
    };
  };

  /**
   * Log a message at a specified log level.
   * @param {LogLevel} level - The log level to use.
   * @param {string} message - The message to log.
   * @param {Object} [optionsOverride] - Optional overrides for the log options.
   * @param {boolean} [optionsOverride.includeTimestamp] - Whether to include a timestamp in the log.
   * @param {boolean} [optionsOverride.logToFile] - Whether to log to a file.
   * @param {string} [optionsOverride.color] - The color to use for the log message.
   */
  public log = (
    level: LogLevel,
    message: string,
    optionsOverride: {
      includeTimestamp?: boolean;
      logToFile?: boolean;
      color?: typeof Color;
    } = {}
  ): void => {
    try {
      const levelOptions = this.levels[level] || {};
      const options = { ...levelOptions, ...optionsOverride };

      const logMessage = `${
        options.includeTimestamp ? new Date().toISOString() : ""
      } ${message}`;

      // Log to the console
      console.log(`[${chalk[options.color || levelOptions.color](level.toUpperCase())}] - ${logMessage}`);

      // Log to the file
      if (options.logToFile || levelOptions.defaultLogToFile) {
        const logFile = path.resolve(this.logsDir, options.logFile || "");
        fsExtra.appendFileSync(logFile, `${logMessage}\n`);
      }
    } catch (error) {
      if (error instanceof TypeError) {
        console.error(`Log level: "${level}" is not defined.`, error.message);
      } else {
        throw error; // Re-throw the error if it's not the expected type
      }
    }
  };
}

type LogLevel = "info" | "warn" | "error" | "verb";

export default Logger.getInstance();
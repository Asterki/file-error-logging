import chalk from "chalk";
import fsExtra from "fs-extra";
import path from "path";

class Logger {
  private static instance: Logger;
  private logsDir: string;
  private logFiles: { [key: string]: string } = {
    info: "info.txt",
    warn: "warn.txt",
    error: "error.txt",
  };

  private constructor() {
    this.logsDir = path.resolve(process.cwd(), "logs");
    fsExtra.ensureDirSync(this.logsDir);
    Object.values(this.logFiles).forEach(file =>
      fsExtra.ensureFileSync(path.join(this.logsDir, file))
    );
  }

  public static getInstance(): Logger {
    if (!Logger.instance) Logger.instance = new Logger();
    return Logger.instance;
  }

  private log(level: "info" | "warn" | "error", message: string, logToFile: boolean) {
    const color = { info: chalk.blue, warn: chalk.yellow, error: chalk.red }[level];
    console.log(`${color(`[${level.toUpperCase()}]`)} ${message}`);

    if (logToFile) {
      fsExtra.appendFileSync(
        path.join(this.logsDir, this.logFiles[level]),
        `[${level.toUpperCase()}] ${message}\n`
      );
    }
  }

  public info(message: string, logToFile: boolean = false) {
    this.log("info", message, logToFile);
  }

  public warn(message: string, logToFile: boolean = false) {
    this.log("warn", message, logToFile);
  }

  public error(message: string, logToFile: boolean = false) {
    this.log("error", message, logToFile);
  }
}

export default Logger.getInstance();
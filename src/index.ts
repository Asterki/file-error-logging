import chalk from "chalk";
import fsExtra from "fs-extra";
import path from "path";

class Logger {
  private static instance: Logger;
  private logsDir: string;

  private constructor() {
    this.logsDir = path.resolve(process.cwd(), "logs"); // Use process.cwd() for cross-environment compatibility
    fsExtra.ensureDirSync(this.logsDir);
    fsExtra.ensureFileSync(path.join(this.logsDir, "info.txt"));
    fsExtra.ensureFileSync(path.join(this.logsDir, "warn.txt"));
    fsExtra.ensureFileSync(path.join(this.logsDir, "error.txt"));
  }

  public static getInstance(): Logger {
    if (!Logger.instance) Logger.instance = new Logger();
    return Logger.instance;
  }

  public info(message: string, logToFile: boolean = false) {
    console.log(`${chalk.blue("[INFO]")} ${message}`);

    if (logToFile) {
      fsExtra.appendFileSync(
        path.join(this.logsDir, "info.txt"),
        `[INFO] ${message}\n`
      );
    }
  }

  public warn(message: string, logToFile: boolean = false) {
    console.log(`${chalk.yellow("[WARN]")} ${message}`);

    if (logToFile) {
      fsExtra.appendFileSync(
        path.join(this.logsDir, "warn.txt"),
        `[WARN] ${message}\n`
      );
    }
  }

  public error(message: string, logToFile: boolean = false) {
    console.log(`${chalk.red("[ERROR]")} ${message}`);

    if (logToFile) {
      fsExtra.appendFileSync(
        path.join(this.logsDir, "error.txt"),
        `[ERROR] ${message}\n`
      );
    }
  }
}

export default Logger.getInstance();

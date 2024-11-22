// src/logger/LogToFile.ts
import fsExtra from "fs-extra";
import path from "path";

export const logToFile = (
  logsDir: string,
  rotation: "daily" | "monthly" | "yearly",
  level: string,
  message: string
): void => {
  const now = new Date();

  if (rotation === "daily") {
    const yearDir = path.resolve(logsDir, now.getFullYear().toString());
    fsExtra.ensureDirSync(yearDir);
    const monthDir = path.resolve(yearDir, (now.getMonth() + 1).toString());
    fsExtra.ensureDirSync(monthDir);
    const dayDir = path.resolve(monthDir, now.getDate().toString());
    fsExtra.ensureDirSync(dayDir);

    const logFile = path.resolve(dayDir, `${level}.log`);
    fsExtra.appendFileSync(logFile, `${message}`);
  }

  if (rotation === "monthly") {
    const yearDir = path.resolve(logsDir, now.getFullYear().toString());
    fsExtra.ensureDirSync(yearDir);
    const monthDir = path.resolve(yearDir, (now.getMonth() + 1).toString());
    fsExtra.ensureDirSync(monthDir);

    const logFile = path.resolve(monthDir, `${level}.log`);
    fsExtra.appendFileSync(logFile, `${message}`);
  }

  if (rotation === "yearly") {
    const yearDir = path.resolve(logsDir, now.getFullYear().toString());
    fsExtra.ensureDirSync(yearDir);

    const logFile = path.resolve(yearDir, `${level}.log`);
    fsExtra.appendFileSync(logFile, `${message}`);
  }
};
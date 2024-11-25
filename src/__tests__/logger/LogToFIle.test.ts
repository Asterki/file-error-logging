import fsExtra from "fs-extra";
import path from "path";
import { logToFile } from "../../logger/LogToFile";

jest.mock("fs-extra");

describe("logToFile", () => {
    const logsDir = "/test/logs";
    const level = "info";
    const message = "Test log message";
    const now = new Date(2024, 10, 25);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it("should create directories and write log for daily rotation", () => {
        jest.spyOn(global, "Date").mockImplementationOnce(() => now as any);

        logToFile(logsDir, "daily", level, message);

        expect(fsExtra.ensureDirSync).toHaveBeenCalledWith(path.resolve(logsDir, "2024"));
        expect(fsExtra.ensureDirSync).toHaveBeenCalledWith(path.resolve(logsDir, "2024", "11"));
        expect(fsExtra.ensureDirSync).toHaveBeenCalledWith(path.resolve(logsDir, "2024", "11", "25"));
        expect(fsExtra.appendFileSync).toHaveBeenCalledWith(path.resolve(logsDir, "2024", "11", "25", `${level}.log`), `${message}\n`);
    });

    it("should create directories and write log for monthly rotation", () => {
        jest.spyOn(global, "Date").mockImplementationOnce(() => now as any);

        logToFile(logsDir, "monthly", level, message);

        expect(fsExtra.ensureDirSync).toHaveBeenCalledWith(path.resolve(logsDir, "2024"));
        expect(fsExtra.ensureDirSync).toHaveBeenCalledWith(path.resolve(logsDir, "2024", "11"));
        expect(fsExtra.appendFileSync).toHaveBeenCalledWith(path.resolve(logsDir, "2024", "11", `${level}.log`), `${message}\n`);
    });

    it("should create directories and write log for yearly rotation", () => {
        jest.spyOn(global, "Date").mockImplementationOnce(() => now as any);

        logToFile(logsDir, "yearly", level, message);

        expect(fsExtra.ensureDirSync).toHaveBeenCalledWith(path.resolve(logsDir, "2024"));
        expect(fsExtra.appendFileSync).toHaveBeenCalledWith(path.resolve(logsDir, "2024", `${level}.log`), `${message}\n`);
    });

    it("should handle empty message correctly", () => {
        jest.spyOn(global, "Date").mockImplementationOnce(() => now as any);

        logToFile(logsDir, "daily", level, "");

        expect(fsExtra.appendFileSync).toHaveBeenCalledWith(path.resolve(logsDir, "2024", "11", "25", `${level}.log`), `\n`);
    });

    it("should handle log with special characters", () => {
        jest.spyOn(global, "Date").mockImplementationOnce(() => now as any);

        const specialMessage = "Log with special characters: @#&$!";

        logToFile(logsDir, "monthly", level, specialMessage);

        expect(fsExtra.appendFileSync).toHaveBeenCalledWith(path.resolve(logsDir, "2024", "11", `${level}.log`), `${specialMessage}\n`);
    });
});

import fsExtra from "fs-extra";
import path from "path";
import chalk from "chalk";
import Logger from "../../logger/Logger";
import { logToFile } from "../../logger/LogToFile";
import { formatTimestamp } from "../../logger/FormatTimestamp";

jest.mock("fs-extra");
jest.mock("../../logger/LogToFile");

describe("Logger", () => {
    const logsDir = path.resolve(process.cwd(), "logs");

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should set configuration using setConfig", () => {
        Logger.setConfig({ logsDir, rotation: "monthly", development: true });
        expect(fsExtra.ensureDirSync).toHaveBeenCalledWith(logsDir);
    });

    it("should add a new log level", () => {
        Logger.addLogLevel("custom", {
            color: "green",
            includeTimestampInConsole: true,
            logToFile: true,
            logFileName: "custom.log",
        });

        expect(fsExtra.ensureFileSync).toHaveBeenCalledWith(logsDir + "/custom.log");
    });

    it("should log messages to the console in development mode", () => {
        Logger.setConfig({ development: true });
        const consoleSpy = jest.spyOn(console, "log").mockImplementation();

        Logger.log("info", "Test message");

        expect(consoleSpy).toHaveBeenCalledWith(
            `[${chalk.blue("INFO")}] -  Test message`
        );

        consoleSpy.mockRestore();
    });

    it("should log messages to a file", () => {
        Logger.log("error", "Test error log");

        expect(logToFile).toHaveBeenCalledWith(
            expect.any(String), // logs directory
            "monthly", // rotation
            "error", // level
            expect.stringContaining("Test error log") // log message
        );
    });

    it("should handle object messages by stringifying them", () => {
        Logger.setConfig({ development: true });
        const consoleSpy = jest.spyOn(console, "log").mockImplementation();

        Logger.log("info", { key: "value" });

        expect(consoleSpy).toHaveBeenCalledWith(
            `[${chalk.blue("INFO")}] -  {\n  "key": "value"\n}`
        );

        consoleSpy.mockRestore();
    });

    it("should throw an error if log level is undefined", () => {
        expect(() => Logger.log("undefinedLevel", "Test message")).toThrow(
            'Log level: "undefinedLevel" is not defined.'
        );
    });

    it("should call onTrigger callback if provided", () => {
        const onTriggerMock = jest.fn();

        Logger.addLogLevel("callbackLevel", {
            color: "green",
            includeTimestampInConsole: true,
            logToFile: false,
            onTrigger: onTriggerMock,
        });

        Logger.log("callbackLevel", "Trigger test");

        const now = new Date();
        const formattedTimestamp = formatTimestamp(now);
        expect(onTriggerMock).toHaveBeenCalledWith(`${formattedTimestamp} Trigger test`);
    });

});

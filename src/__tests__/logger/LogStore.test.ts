import { LogStore } from "../../logger/Store";

describe("LogStore", () => {
    let logStore: LogStore;

    beforeEach(() => {
        logStore = new LogStore();
    });

    it("should add logs correctly", () => {
        logStore.addLog("info", "Test log", { user: "JohnDoe" });
        const logs = logStore.query({});
        expect(logs).toHaveLength(1);
        expect(logs[0]).toMatchObject({
            level: "info",
            message: "Test log",
            context: { user: "JohnDoe" },
        });
    });

    it("should filter logs by level", () => {
        logStore.addLog("info", "Info log");
        logStore.addLog("error", "Error log");

        const infoLogs = logStore.query({ level: "info" });
        expect(infoLogs).toHaveLength(1);
        expect(infoLogs[0].level).toBe("info");

        const errorLogs = logStore.query({ level: "error" });
        expect(errorLogs).toHaveLength(1);
        expect(errorLogs[0].level).toBe("error");
    });

    it("should filter logs by timestamp", () => {
        const now = new Date();
        const past = new Date(now.getTime() - 1000 * 60);
        const future = new Date(now.getTime() + 1000 * 60);

        logStore.addLog("info", "Past log", { time: past });
        logStore.addLog("info", "Future log", { time: future });

        const recentLogs = logStore.query({ since: now });
        expect(recentLogs).toHaveLength(2);
        expect(recentLogs[0].message).toBe("Past log");
    });

    it("should filter logs by context", () => {
        logStore.addLog("info", "Log 1", { user: "JohnDoe" });
        logStore.addLog("info", "Log 2", { user: "JaneDoe" });
        logStore.addLog("info", "Log 3", { user: "JohnDoe", session: "xyz" });

        const userLogs = logStore.query({ context: { user: "JohnDoe" } });
        expect(userLogs).toHaveLength(2);
        expect(userLogs).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ message: "Log 1" }),
                expect.objectContaining({ message: "Log 3" }),
            ])
        );

        const specificLogs = logStore.query({
            context: { user: "JohnDoe", session: "xyz" },
        });
        expect(specificLogs).toHaveLength(1);
        expect(specificLogs[0].message).toBe("Log 3");
    });

    it("should return all logs when no filters are applied", () => {
        logStore.addLog("info", "Log 1");
        logStore.addLog("error", "Log 2");

        const allLogs = logStore.query({});
        expect(allLogs).toHaveLength(2);
    });
});

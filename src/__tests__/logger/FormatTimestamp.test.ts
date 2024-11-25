import { formatTimestamp } from "../../logger/FormatTimestamp";

describe("formatTimestamp", () => {
    it("should format a full timestamp correctly", () => {
        const date = new Date("2024-11-25T15:04:05Z");
        const result = formatTimestamp(date);
        expect(result).toBe("12:04:05 - 2024/11/25");
    });

    it("should handle single-digit hours, minutes, and seconds", () => {
        const date = new Date("2024-01-02T03:04:05Z");
        const result = formatTimestamp(date);
        expect(result).toBe("00:04:05 - 2024/01/02");
    });

    it("should format correctly for months and days with leading zeros", () => {
        const date = new Date("2024-02-09T10:09:30Z");
        const result = formatTimestamp(date);
        expect(result).toBe("07:09:30 - 2024/02/09");
    });

    it("should handle edge cases for end of year", () => {
        const date = new Date("2023-12-31T23:59:59Z");
        const result = formatTimestamp(date);
        expect(result).toBe("20:59:59 - 2023/12/31");
    });

    it("should handle edge cases for leap years", () => {
        const date = new Date("2024-02-29T12:00:00Z");
        const result = formatTimestamp(date);
        expect(result).toBe("09:00:00 - 2024/02/29");
    });
});

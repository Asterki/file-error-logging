# Configuration

The `file-error-logging` library allows you to configure various aspects of logging to suit your needs. You can set the configuration using the `setConfig` method.

## Configuration Options

### `logsDir`

- **Type**: `string`
- **Description**: The directory to store log files.
- **Default**: `./logs`

### `rotation`

- **Type**: `"daily" | "monthly" | "yearly"`
- **Description**: The log rotation policy.
- **Default**: `"daily"`

### `development`

- **Type**: `boolean`
- **Description**: Whether to log to the console.
- **Default**: `false`

## Example

Here's an example of how to configure the logger:

```typescript
import Logger from "file-error-logging";

// Configure the logger
Logger.setConfig({
  logsDir: "./custom-logs",
  rotation: "monthly",
  development: true,
});
```

# Adding Custom Log Levels

You can add custom log levels with their own color, timestamping, and file logging rules using the `addLogLevel` method.

**`addLogLevel` Parameters**
- `level`: The name of the log level.
- `color`: The color associated with the log level.
- `includeTimestampInConsole`: Whether to include a timestamp in the console log.
- `logToFile`: Whether to log to a file.
- `logFileName`: The file to log to, if applicable.

## Example
```ts
import Logger from "file-error-logging";

// Add a new custom log level
Logger.addLogLevel("debug", {
  color: "green",
  includeTimestampInConsole: true,
  logToFile: true,
  logFileName: "debug.log",
});

// Log a message with the custom log level
Logger.log("debug", "This is a debug message");
```

# Logging Messages
You can log messages at different levels using the `log` method. You can also override the default options for each log message.

**`log` Parameters**
- `level`: The log level to use.
- `message`: The message to log.
- `optionsOverride`: Optional overrides for the log options.
    - `includeTimestampInConsole`: Whether to include a timestamp in the console log.
    - `logToFile`: Whether to log to a file.
    - `color`: The color to use for the log message.

## Example
```ts
import Logger from "file-error-logging";

// Log messages with different levels
Logger.log("info", "This is an info message", {
  includeTimestampInConsole: true,
  logToFile: true,
  color: "whiteBright",
});
Logger.log("warn", "This is a warning message");
Logger.log("verb", "This is a verbose message");
Logger.log("error", new Error("This is an error message"));
```
# file-error-logging

A lightweight, flexible logging library for Node.js applications. This library provides an intuitive API for managing log levels, formatting logs, and writing logs to files. It includes a Singleton-based Logger class with out-of-the-box support for logging `info`, `warn`, `error`, and `verbose` levels. 

Future updates will introduce a **CLI** for easier configuration and use.

## Features

- **Default Log Levels**: `info`, `warn`, `error`, `verb` (verbose).
- **File-based Logging**: Logs are written to individual files for each log level.
- **Log Rotation**: Save logs on folders depending on the day, month or year.
- **Dynamic Configuration**: Add custom log levels with their own color, timestamping, and file logging rules.
- **Extensive Configuration**: Change the behavior of the logger by passing an options object.
- **Singleton Pattern**: Ensures a single instance of the logger throughout the application.

## Installation

To install the package, use npm:

```bash
npm install file-error-logging
```

## Usage

### Basic Example

```typescript
import Logger from "file-error-logging";

// Configure the logger
Logger.setConfig({
  development: false,
  rotation: "monthly",
});

// Log messages with different levels
Logger.log("info", "This is an info message", {
  includeTimestampInConsole: true,
  logToFile: false,
  color: "whiteBright",
});
Logger.log("warn", "This is a warning message", {
  includeTimestampInConsole: false
});
Logger.log("verb", "This is a verbose message");
Logger.log("error", new Error("This is an error message"));
```

### Adding a Custom Log Level

```typescript
// Add a new custom log level
Logger.addLogLevel("question", {
  color: "cyan",
  logToFile: true,
  includeTimestampInConsole: true,
  logFileName: "questions.log",
});

// Log a message with the custom log level
Logger.log("question", "What is the meaning of life?");
```

### Overriding Default Options

You can override log level configurations on a per-message basis.

```typescript
Logger.log("info", "Custom timestamp and color", {
  includeTimestampInConsole: true,
  color: "green",
});
```

### Logs Directory

By default, logs are stored in the `logs` directory at the root of your project. Ensure your application has the necessary permissions to create and write to this directory.

You can change this behavior by changing the logsDirectory option on the `setConfig` method.

## API Reference

### Methods

#### `Logger.getInstance()`
Returns the singleton instance of the logger.

#### `Logger.log(level: LogLevel, message: string, options?: Object)`
Logs a message at the specified log level.

- `level`: The log level (`info`, `warn`, `error`, `verb`, or custom).
- `message`: The message to log.
- `options`: Optional overrides for `includeTimestamp`, `logToFile`, and `color`.

#### `Logger.addLogLevel(name: string, params: Object)`
Adds a new log level with specified configurations.

- `name`: The name for the log level.
- `params.color`: The color used for console output.
- `params.includeTimestampInConsole`: Whether to include timestamps in the logs.
- `params.logToFile`: Whether to log messages to a file.
- `params.logFileName`: File name for the logs (optional).

### `Logger.setConfig(params: Object)`
Sets the configuration to be used by the Logger through the entire project.

- `params.logsDir`: Changes the directory in which the logs will be stored (optional).
- `params.rotation`: Sets the rotation period for logs, splitting them by date (optional).
- `params.development`: Avoids sending logs to console if set to false (optional). 

## Contributing

Contributions are welcome! Please submit a pull request or file an issue on the [GitHub repository](https://github.com/Asterki/file-error-logging).

## License

This project is licensed under the Apache-v2.0 License. See the [LICENSE](./LICENSE) file for details.

---

Happy Logging!

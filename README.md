# file-error-logging

A lightweight, flexible logging library for Node.js applications. This library provides an intuitive API for managing log levels, formatting logs, and writing logs to files. It includes a Singleton-based Logger class with out-of-the-box support for logging `info`, `warn`, `error`, and `verbose` levels. 

Future updates will introduce **log rotation**, **custom log levels**, and a **CLI** for easier configuration and use.

## Features

- **Default Log Levels**: `info`, `warn`, `error`, `verb` (verbose).
- **File-based Logging**: Logs are written to individual files for each log level.
- **Dynamic Configuration**: Add custom log levels with their own color, timestamping, and file logging rules.
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

// Log an informational message
Logger.log("info", "This is an informational message.");

// Log a warning message
Logger.log("warn", "This is a warning message.");

// Log an error
Logger.log("error", "This is an error message.");

// Log a verbose/debug message
Logger.log("verb", "This is a verbose message.");
```

### Adding a Custom Log Level

```typescript
Logger.addLogLevel({
  level: "custom",
  color: "magenta",
  includeTimestamp: true,
  logToFile: true,
  logFile: "custom.log",
});

// Use the custom log level
Logger.log("custom", "This is a custom log message.");
```

### Overriding Default Options

You can override log level configurations on a per-message basis.

```typescript
Logger.log("info", "Custom timestamp and color", {
  includeTimestamp: true,
  color: "green",
});
```

### Logs Directory

By default, logs are stored in the `logs` directory at the root of your project. Ensure your application has the necessary permissions to create and write to this directory.

## API Reference

### Methods

#### `Logger.getInstance()`
Returns the singleton instance of the logger.

#### `Logger.log(level: LogLevel, message: string, options?: Object)`
Logs a message at the specified log level.

- `level`: The log level (`info`, `warn`, `error`, `verb`, or custom).
- `message`: The message to log.
- `options`: Optional overrides for `includeTimestamp`, `logToFile`, and `color`.

#### `Logger.addLogLevel(params: Object)`
Adds a new log level with specified configurations.

- `params.level`: The name of the new log level.
- `params.color`: The color used for console output.
- `params.includeTimestamp`: Whether to include timestamps in the logs.
- `params.logToFile`: Whether to log messages to a file.
- `params.logFile`: File name for the logs (optional).

## Future Features

- **Log Rotation**: Automatically rotate log files based on size or time.
- **Custom Log Levels**: Enhance flexibility with user-defined log configurations.
- **CLI**: A command-line interface for managing logger configurations and viewing logs.

## Contributing

Contributions are welcome! Please submit a pull request or file an issue on the [GitHub repository](https://github.com/Asterki/file-error-logging).

## License

This project is licensed under the Apache-v2.0 License. See the [LICENSE](./LICENSE) file for details.

---

Happy Logging!

# file-error-logging

A lightweight, flexible logging library for Node.js applications. This library provides an intuitive API for managing log levels, formatting logs, and writing logs to files. It includes a Singleton-based Logger class with out-of-the-box support for logging `info`, `warn`, `error`, and `verbose` levels. 

Future updates will introduce a **CLI** for easier configuration and use.

Related pages:
- [Configuration](./configuration.md)
- [Changelog](./changelog.md)

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

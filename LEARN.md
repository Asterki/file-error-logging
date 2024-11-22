# File Error Logging

This project started off as a utility that I would use frequently in my projects. It became repetitive, and sometimes I wished I just had an NPM library that could do it, so I created one.

I present to you: **file-error-logging**, a library whose purpose is to log items to the console and to files without having to worry about the environment and log preservation.

## Installation

To install the library, use the following command:

```sh
npm install file-error-logging
```

## Usage
Here's an example on how to use the library:
```ts
import Logger from "file-error-logging";

// Configure the logger
Logger.setConfig({
  development: false,
  rotation: "yearly",
});

// Log messages with different levels
Logger.log("info", "This is an info message", {
  includeTimestampInConsole: true,
  logToFile: true,
  color: "whiteBright",
});
Logger.log("warn", "This is a warning message");
Logger.log("verb", "This is a verbose message");
Logger.log("error", new Error("This is an error message"));

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

## API
Refer to [README.md](./README.md)
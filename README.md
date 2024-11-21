# File Error Logging

A simple, lightweight, and customizable logging library for Node.js, built with TypeScript. Automatically logs messages to the console and files, with optional color-coded output.

## Features

- **Singleton Pattern**: Ensures a single logging instance across your application.
- **Log Levels**: Supports `info`, `warn`, and `error` log levels.
- **File Logging**: Optionally writes logs to files.
- **Color-Coded Console Output**: Uses `chalk` for beautiful, readable logs.
- **Automatic File Management**: Creates and manages log files automatically.

## Installation

Install the package via npm:

```bash
npm install file-error-logging
```

## Usage

Import the logger and start logging:

### Basic Logging

```javascript
import Logger from 'logger-pro';

Logger.info('This is an info message');
Logger.warn('This is a warning message');
Logger.error('This is an error message');
```

### Log to Files

Enable file logging by setting the `logToFile` parameter to `true`:

```javascript
Logger.info('This will also be written to the log file', true);
Logger.warn('This warning is logged to the file', true);
Logger.error('This error is logged to the file', true);
```

### File Location

By default, logs are saved in a `logs` directory at the root of your project:
- `logs/info.txt`
- `logs/warn.txt`
- `logs/error.txt`

### Custom Log Directory

The library uses the current working directory (`process.cwd()`) to determine where to create the `logs` folder. Ensure your application has write permissions.

## Configuration

This library currently uses default settings for simplicity. Future versions will allow configuration for:
- Custom log file paths
- Log rotation
- Log level filtering

## API

### `Logger.info(message: string, logToFile: boolean = false)`
Logs an informational message to the console (blue text) and optionally to `info.txt`.

### `Logger.warn(message: string, logToFile: boolean = false)`
Logs a warning message to the console (yellow text) and optionally to `warn.txt`.

### `Logger.error(message: string, logToFile: boolean = false)`
Logs an error message to the console (red text) and optionally to `error.txt`.

## Example

Here’s a complete example in an Express.js application:

```javascript
import express from 'express';
import Logger from 'logger-pro';

const app = express();

app.get('/', (req, res) => {
  Logger.info('Received a GET request at /');
  res.send('Hello, World!');
});

app.get('/error', (req, res) => {
  Logger.error('Simulated error occurred', true);
  res.status(500).send('Something went wrong');
});

app.listen(3000, () => {
  Logger.info('Server is running on port 3000', true);
});
```

## Dependencies

- [chalk](https://www.npmjs.com/package/chalk) for color-coded console logs.
- [fs-extra](https://www.npmjs.com/package/fs-extra) for file management.

## Contributing

Contributions are welcome! If you have ideas for new features or bug fixes, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.


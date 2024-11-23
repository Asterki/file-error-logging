# Changelog

## [1.2.2] - 2024-11-22 Added
- Introduced `Logger.setConfig` method to configure log directory, rotation policy, and development mode.
- Added `Logger.addLogLevel` method to allow custom log levels with configurable color, timestamping, and file logging rules.
- Enhanced `Logger.log` method to support dynamic options for each log message, including `includeTimestampInConsole`, `logToFile`, and `color`.
- Implemented log rotation with options for `daily`, `monthly`, and `yearly`.
- Improved logging to include timestamps in the format `hour:minute:second - year/month/day`.
- Modularized the codebase for better maintainability and readability.

### Changed
- Refactored the code to use a Singleton pattern for the `Logger` class.
- Updated default log levels to include `info`, `warn`, `error`, and `verb` (verbose).

## [1.0.0] - 2024-11-21 Initial Release
### Added
- Basic logging functionality with three methods: `warn`, `info`, and `error`.
- Logs written to individual files for each log level.
- Fixed colors for each log level:
  - `info`: Blue
  - `warn`: Yellow
  - `error`: Red
- No configuration options available.
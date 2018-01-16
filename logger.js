const chalk = require('chalk')
const log = console.log

exports.log = log
exports.success = (...args) => log(chalk.green('[✔] ', ...args))
exports.error = (...args) => log(chalk.red('[✘] ', ...args))
exports.info = (...args) => log(chalk.yellow('[i] ', ...args))
exports.debug = (...args) => log(chalk.cyan('[DEBUG]', ...args))

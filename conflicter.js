const { pathExists } = require('fs-extra')
const detectConflict = require('detect-conflict')
const prompt = require('inquirer').prompt

function Conflicter(overwriteAll=false, backupAll=false, skipAll=false) {

  const state = {
    overwriteAll,
    backupAll,
    skipAll
  }
  
  const checkCollision = async (file, cb) => {
    const {filepath, contents} = file

    if (!await pathExists(filepath)) {
      cb(file, 'create')
      return
    }

    if (
      state.overwriteAll === false &&
      state.backupAll === false &&
      state.skipAll === false
    ) {
      if (detectConflict(filepath, contents)) {
        await ask(file, cb)
      } else {
        cb(file, 'identical')
      }
      return
    }

    if (state.overwriteAll) cb(file, 'overwrite')
    if (state.backupAll) cb(file, 'backup')
    if (state.skipAll) cb(file, 'skip')
  }

  const ask = async (file, cb) => {
    const prompts = {
      name: 'action',
      type: 'list',
      message: `Overwrite ${file.filepath}?`,
      choices: ['overwrite', 'overwrite all', 'backup', 'backup all', 'skip', 'skip all'],
      default: 0
    }
    const results = await prompt(prompts)
    const [action, all] = results.action.split(' ')

    if (all) {
      state[action + 'All'] = true
    }

    cb(file, action)
  }

  return { check: checkCollision }
}

module.exports = Conflicter

const fs = require('fs')
const path = require('path')
const kebabCase = require('lodash/kebabCase')
const globby = require('globby')
const ignore = require('ignore')
const {shell} = require('execa')

exports.shellArgs = (argv = {}, inputs = []) => {
  const args = []
  Object.keys(argv).forEach(key => {
    const value = argv[key]
    const k = kebabCase(key)
    if (typeof value === 'boolean') {
      args.push(value ? `--${k}` : `--no-${k}`)
    } else if (typeof value !== 'undefined') {
      if (Array.isArray(value)) {
        value.forEach(v => args.push(`--${k}`, v))
      } else {
        args.push(`--${k}`, value)
      }
    }
  })
  return args.concat(inputs)
}

// TODO: support ignore files from sub folders
exports.gitignore = (files, ignoreFile = '.gitignore') => {
  if (fs.existsSync(ignoreFile)) {
    return ignore()
      .add(fs.readFileSync(ignoreFile).toString())
      .filter(
        files.map(file =>
          path.isAbsolute(file) ? path.relative(process.cwd(), file) : file
        )
      )
  }
  return files
}

exports.findFiles = async (patterns, options, exts = []) => {
  const paths = await globby(patterns, options)
  return paths.filter(path => exts.some(ext => path.endsWith(ext)))
}

exports.getChangedFiles = async () => {
  const {stdout} = await shell(
    'git diff origin/master --name-only --diff-filter=ACMRTUB'
  )
  return stdout ? stdout.split('\n') : []
}

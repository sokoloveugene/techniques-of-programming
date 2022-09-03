const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')
const { isQuery } = require('./query.js')

class ApiInterfaceBuilder {
  constructor(schema) {
    this.generatedInterfaces = new Set()
    this.getInterface('RootService', schema)
  }

  getInterface(name, schema) {
    const parts = []

    parts.push(`export interface ${this.getInterfaceName(name)} {`)

    for (const [field, value] of Object.entries(schema)) {
      if (isQuery(value)) {
        const generic = `<R${value.hasPayload ? ', P = unknown' : ''}>`
        parts.push(`${field}${generic}${this.getMethod(value)}`)
      } else {
        parts.push(`${field}: ${this.getInterfaceName(field)},`)
        this.getInterface(field, value)
      }
    }

    parts.push('};')
    this.generatedInterfaces.add(parts.join('\n'))
  }

  getMethod(query) {
    const listOfParams = this.getArgumentList(query.url)
    const hasParam = listOfParams.length !== 0 || query.hasPayload

    if (!hasParam) return `(): ${this.returnType}`

    const parts = []
    parts.push('(params: {')

    for (const param of listOfParams) {
      const [name, type = 'unknown'] = param.split(/\??:/)
      parts.push(`${name}: ${type},`)
    }

    if (query.hasPayload) {
      parts.push(`payload?: P,`)
    }

    parts.push(`config?: any,`)

    parts.push(`})`)
    return parts.join('\n').concat(`: ${this.returnType}`)
  }

  getArgumentList(template) {
    return [...template.matchAll(/{{(.*?)}}/g)].reduce(
      (acc, match, index) => (index === 0 ? acc : [...acc, match[1]]),
      []
    )
  }

  capitalize(string) {
    return string.slice(0, 1).toUpperCase() + string.slice(1)
  }

  getInterfaceName(serviceName) {
    const base = `I${this.capitalize(serviceName)}`
    return base.endsWith('Service') ? base : `${base}Service`
  }

  get returnType() {
    return `Promise<R>;`
  }
}

const printTypes = () => {
  const [input, output] = [process.argv[3], process.argv[5]]

  if (!input || !output) {
    throw new Error('Run command with correct arguments')
  }

  const { schema } = require(path.join(process.cwd(), input), 'utf-8')

  const { generatedInterfaces } = new ApiInterfaceBuilder(schema)

  const generatedLines = [...generatedInterfaces].join('\n')

  const writeToPath = path.join(process.cwd(), output)

  fs.writeFileSync(writeToPath, generatedLines, 'utf8')

  exec(`prettier --write ${writeToPath}`, (error) => {
    if (error) {
      console.error(`prettier error: ${error}`)
      return
    }
    console.log(`prettier done`)
  })
}

printTypes()

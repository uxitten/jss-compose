const consoleWarn = console.warn.bind(console) // eslint-disable-line no-console

/**
 * Set additional unnamed class.
 *
 * @param {Object} original rule
 * @param {String} compostion class string
 * @return {Boolean} flag, indicating function was successfull or not
 */
const setClass = (rule, composition) => {
  const container = rule.options.parent

  rule.className += ` ${composition}`
  container.classes[rule.name] = rule.className

  return true
}

/**
 * Set additional named class.
 *
 * @param {Object} original rule
 * @param {String} compostion class string
 * @return {Boolean} flag, indicating function was successfull or not
 */
const setNamedClass = (rule, composition, warn) => {
  const refRule = rule.options.sheet.getRule(composition.substr(1))

  if (!refRule) {
    warn(`[JSS] A rule tries to compose with non-existant internal selector \r\n${rule.toString()}`)
    return false
  }
  if (refRule === rule) {
    warn(`[JSS] A rule tries to compose itself \r\n${rule.toString()}`)
    return false
  }
  setClass(rule, refRule.className)

  return true
}

/**
 * Convert compose property to additional class, remove property from original styles.
 *
 * @param {Rule} rule
 * @api public
 */
export default function jssCompose({warn = consoleWarn} = {}) {
  return rule => {
    if (!rule.style || !rule.style.composes) return
    if (rule.options.named) {
      const style = rule.style

      if (typeof style.composes == 'string') {
        if (style.composes[0] === '$') {
          setNamedClass(rule, style.composes, warn)
        }
        else {
          setClass(rule, style.composes)
        }
      }
      else if (Array.isArray(style.composes)) {
        for (let index = 0; index < style.composes.length; index++) {
          if (style.composes[index][0] === '$') {
            setNamedClass(rule, style.composes[index], warn)
          }
          else {
            setClass(rule, style.composes[index])
          }
        }
      }
    }
    // Remove composes property before attaching to prevent infinite call stack.
    delete rule.style.composes
  }
}

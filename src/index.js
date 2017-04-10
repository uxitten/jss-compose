import warning from 'warning'

/**
 * Set class name.
 *
 * @param {Object} original rule
 * @param {String} compostion class string
 * @return {Boolean} flag, indicating function was successfull or not
 */
function setClass(rule, composition) {
  // Skip falsy values
  if (!composition) return true

  if (Array.isArray(composition)) {
    for (let index = 0; index < composition.length; index++) {
      const isSetted = setClass(rule, composition[index])
      if (!isSetted) return false
    }

    return true
  }

  if (composition.indexOf(' ') > -1) {
    return setClass(rule, composition.split(' '))
  }

  if (composition[0] === '$') {
    const refRule = rule.options.sheet.getRule(composition.substr(1))

    if (!refRule) {
      warning(false, '[JSS] Referenced rule is not defined. \r\n%s', rule)
      return false
    }
    if (refRule === rule) {
      warning(false, '[JSS] Cyclic composition detected. \r\n%s', rule)
      return false
    }
    setClass(rule, refRule.className)
    return true
  }

  const container = rule.options.parent
  rule.className += ` ${composition}`
  container.classes[rule.name] = rule.className
  return true
}

/**
 * Convert compose property to additional class, remove property from original styles.
 *
 * @param {Rule} rule
 * @api public
 */
export default function jssCompose() {
  function onProcessRule(rule) {
    const {style} = rule
    if (!style || !style.composes) return
    setClass(rule, style.composes)
    // Remove composes property to prevent infinite loop.
    delete style.composes
  }
  return {onProcessRule}
}

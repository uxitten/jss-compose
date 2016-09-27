import warning from 'warning'

/**
 * Set class name.
 *
 * @param {Object} original rule
 * @param {String} compostion class string
 * @return {Boolean} flag, indicating function was successfull or not
 */
function setClass(rule, composition) {
  if (composition[0] === '$') {
    const refRule = rule.options.sheet.getRule(composition.substr(1))

    if (!refRule) {
      warning(false, `[JSS] Referenced rule is not defined. \r\n%s`, rule)
      return false
    }
    if (refRule === rule) {
      warning(false, `[JSS] Cyclic composition detected. \r\n%s`, rule)
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
  return (rule) => {
    const {style} = rule

    if (!style || !style.composes) return

    if (rule.options.named) {
      if (Array.isArray(style.composes)) {
        for (let index = 0; index < style.composes.length; index++) {
          setClass(rule, style.composes[index])
        }
      }
      else setClass(rule, style.composes)
    }

    // Remove composes property to prevent infinite loop.
    delete style.composes
  }
}

import expect from 'expect.js'
import compose from './index'
import {create} from 'jss'

const noWarn = message => expect(message).to.be(undefined)

describe('jss-compose', () => {
  let jss

  beforeEach(() => {
    jss = create().use(compose({warn: noWarn}))
  })

  describe('Unnamed rules', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {
          float: 'left'
        },
        b: {
          composes: 'a',
          color: 'red'
        }
      }, {named: false})
    })

    it('should add rules', () => {
      expect(sheet.getRule('a')).to.not.be(undefined)
      expect(sheet.getRule('b')).to.not.be(undefined)
    })

    it('shouldn\'nt compose classes', () => {
      expect(sheet.getRule('b').className).to.be('')
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be(
        'a {\n' +
        '  float: left;\n' +
        '}\n' +
        'b {\n' +
        '  color: red;\n' +
        '}'
      )
    })
  })

  describe('Named composition', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {
          float: 'left'
        },
        b: {
          composes: '$a',
          color: 'red'
        }
      })
    })

    it('should add rules', () => {
      expect(sheet.getRule('a')).to.not.be(undefined)
      expect(sheet.getRule('b')).to.not.be(undefined)
    })

    it('should compose classes', () => {
      expect(sheet.getRule('b').className).to.be('b-3538039808 a-3787690649')
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be(
        '.a-3787690649 {\n' +
        '  float: left;\n' +
        '}\n' +
        '.b-3538039808 {\n' +
        '  color: red;\n' +
        '}'
      )
    })
  })
})

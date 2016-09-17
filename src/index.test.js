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

  describe('Named selector composed with unnamed one', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {
          composes: 'b',
          color: 'red'
        }
      })
    })

    it('should add rule', () => {
      expect(sheet.getRule('a')).to.not.be(undefined)
    })

    it('should compose classes', () => {
      expect(sheet.getRule('a').className).to.be('a-4193320358 b')
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be(
        '.a-4193320358 {\n' +
        '  color: red;\n' +
        '}'
      )
    })
  })

  describe('Array of named classes composition', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {
          float: 'left'
        },
        b: {
          color: 'red'
        },
        c: {
          background: 'blue'
        },
        d: {
          composes: ['$a', '$b', '$c'],
          border: 'none'
        }
      })
    })

    it('should add rules', () => {
      expect(sheet.getRule('a')).to.not.be(undefined)
      expect(sheet.getRule('b')).to.not.be(undefined)
      expect(sheet.getRule('c')).to.not.be(undefined)
      expect(sheet.getRule('d')).to.not.be(undefined)
    })

    it('should compose classes', () => {
      expect(sheet.getRule('d').className)
        .to.be('d-452344379 a-3787690649 b-3645560457 c-3525728718')
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be(
        '.a-3787690649 {\n' +
        '  float: left;\n' +
        '}\n' +
        '.b-3645560457 {\n' +
        '  color: red;\n' +
        '}\n' +
        '.c-3525728718 {\n' +
        '  background: blue;\n' +
        '}\n' +
        '.d-452344379 {\n' +
        '  border: none;\n' +
        '}'
      )
    })
  })

  describe('Mixed composition (named and unnamed classes)', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {
          float: 'left'
        },
        b: {
          composes: ['$a', 'c', 'd'],
          color: 'red'
        }
      })
    })

    it('should add rules', () => {
      expect(sheet.getRule('a')).to.not.be(undefined)
      expect(sheet.getRule('b')).to.not.be(undefined)
    })

    it('should compose classes', () => {
      expect(sheet.getRule('b').className).to.be('b-3696614589 a-3787690649 c d')
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be(
        '.a-3787690649 {\n' +
        '  float: left;\n' +
        '}\n' +
        '.b-3696614589 {\n' +
        '  color: red;\n' +
        '}'
      )
    })
  })

  describe('Nested compositions (compose composed)', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {
          float: 'left'
        },
        b: {
          composes: ['$a', 'd'],
          color: 'red'
        },
        c: {
          composes: ['$b'],
          background: 'blue'
        }
      })
    })

    it('should add rules', () => {
      expect(sheet.getRule('a')).to.not.be(undefined)
      expect(sheet.getRule('b')).to.not.be(undefined)
      expect(sheet.getRule('c')).to.not.be(undefined)
    })

    it('should compose classes', () => {
      expect(sheet.getRule('b').className).to.be('b-3337890504 a-3787690649 d')
      expect(sheet.getRule('c').className).to.be('c-3560954838 b-3337890504 a-3787690649 d')
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be(
        '.a-3787690649 {\n' +
        '  float: left;\n' +
        '}\n' +
        '.b-3337890504 {\n' +
        '  color: red;\n' +
        '}\n' +
        '.c-3560954838 {\n' +
        '  background: blue;\n' +
        '}'
      )
    })
  })

  describe('Warnings', () => {
    let localJss
    let warning

    beforeEach(() => {
      const warn = message => {
        warning = message
      }
      localJss = create().use(compose({warn}))
    })

    afterEach(() => {
      warning = null
    })

    it('should warn when rule try to compose itself', () => {
      localJss.createStyleSheet({
        a: {
          composes: ['$a'],
          color: 'red'
        }
      })
      expect(warning).to.be('[JSS] A rule tries to compose itself \r\n.a-3512327961 {\n  composes: $a;\n  color: red;\n}') // eslint-disable-line max-len
    })

    it('should warn when try to compose non-existant named selector', () => {
      localJss.createStyleSheet({
        a: {
          composes: ['$b'],
          color: 'red'
        }
      })
      expect(warning).to.be('[JSS] A rule tries to compose with non-existant internal selector \r\n.a-1790758707 {\n  composes: $b;\n  color: red;\n}') // eslint-disable-line max-len
    })
  })
})

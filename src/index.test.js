/* eslint-disable no-underscore-dangle */

import expect from 'expect.js'
import {create} from 'jss'
import compose from './'

describe('jss-compose', () => {
  let jss
  let warning

  beforeEach(() => {
    compose.__Rewire__('warning', (condition, message) => {
      warning = message
    })
    jss = create().use(compose())
  })

  afterEach(() => {
    compose.__ResetDependency__('warning')
    warning = undefined
  })

  describe('Ref composition', () => {
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

    afterEach(() => {
      expect(warning).to.be(undefined)
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

  describe('Global class composition', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {
          composes: 'b',
          color: 'red'
        }
      })
    })

    afterEach(() => {
      expect(warning).to.be(undefined)
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

  describe('Array of refs composition', () => {
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

    afterEach(() => {
      expect(warning).to.be(undefined)
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

  describe('Mixed composition', () => {
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

    afterEach(() => {
      expect(warning).to.be(undefined)
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

    afterEach(() => {
      expect(warning).to.be(undefined)
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
    it('should warn when rule try to compose itself', () => {
      jss.createStyleSheet({
        a: {
          composes: ['$a'],
          color: 'red'
        }
      })
      expect(warning).to.be('[JSS] Cyclic composition detected. \r\n%s')
    })

    it('should warn when try to compose ref which can\'t be resolved', () => {
      jss.createStyleSheet({
        a: {
          composes: ['$b'],
          color: 'red'
        }
      })
      expect(warning).to.be('[JSS] Referenced rule is not defined. \r\n%s')
    })
  })
})

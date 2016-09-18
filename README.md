![JSS logo](https://avatars1.githubusercontent.com/u/9503099?v=3&s=60)

## JSS plugin that enables selector composition

There are few things that you must consider before use *jss-compose*:
* Composition doesn't work with [named stylesheets](https://github.com/cssinjs/jss/blob/master/docs/json-api.md#writing-global-selectors).
* `composes` property accepts strings or arrays.
* Composition works only if the resulting selector is a single class name (don't try to put `composes` property inside nested selector if you use [jss-nested](https://github.com/cssinjs/jss-nested)).
* Composition works only if you compose rule, that is defined **AFTER** rule, where you write `composes` (Otherwise you get wrong css selector order and priority).

Make sure you read [how to use
plugins](https://github.com/cssinjs/jss/blob/master/docs/setup.md#setup-with-plugins)
in general.

## Usage example

#### 1. Composition with unnamed (global) selector

It's usefull if you want to combine jss with style frameworks such [Material Design Lite](https://getmdl.io/) or [Bootstrap](http://getbootstrap.com/) or any other.

```javascript
const sheet = jss.createStyleSheet({
  button: {
    composes: 'btn',
    color: 'red'
  }
  buttonActive: {
    composes: ['btn', 'btn-primary'], // You can use arrays too
    color: 'blue'
  }
})
```
Compiles to:
```css
.button-123456 {
  color: red;
}
.buttonActive-123456 {
  color: blue;
}
```
When you use it:
```javascript
<button className={sheet.classes.button}>Button</button>
<button className={sheet.classes.buttonActive}>Active Button</button>
```
It renders to:
```html
<button class="button-123456 btn">Button</button>
<button class="button-123456 btn btn-primary">Active Button</button>
```

#### 2. Composition with named selector

This approach is usefull if you want manage elements states without additinal styles duplication (e.g. button with active, disabled states).
To use it - simple add `$` symbol before rule, that you want to compose.

```javascript
const sheet = jss.createStyleSheet({
  button: {
    color: 'black'
  },

  // You can chain compositions
  buttonActive: {
    composes: '$button',
    color: 'red'
  },
  buttonActiveDisabled: {
    composes: '$buttonActive',
    opacity: 0.5
  },

  // Or use arrays
  disabled: {
    opacity: 0.5
  },
  active: {
    color: 'red'
  },
  buttonDisabled: {
    composes: ['$button', '$active', '$disabled']
  }
})
```
Compiles to:
```css
.button-123456 {
  color: black;
}
.buttonActive-123456 {
  color: red;
}
.buttonActiveDisabled-123456 {
  opacity: 0.5;
}
.disabled-123456 {
  opacity: 0.5;
}
.active-123456 {
  color: red;
}
/* .buttonDisabled is not printed here, because it have only compositon and no styles inside */
```
When you use it:
```javascript
<button className={sheet.classes.buttonActiveDisabled}>Active Disabled Button</button>
<button className={sheet.classes.buttonDisabled}>Disabled Button with active state</button>
```
It renders to:
```html
<button class="button-123456 buttonActive-123456">Active Disabled Button</button>
<button class="buttonDisabled-123456 button-123456 active-123456 disabled-123456">Disabled Button with active state</button>
```

#### 3. Mixed composition

You can compose both internal named selectors and external global (unnamed) selectors

```javascript
const sheet = jss.createStyleSheet({
  active: {
    color: 'red'
  }
  button: {
    composes: ['$active', 'btn', 'btn-primary'], // You can use arrays too
    color: 'blue'
  }
})
```
Compiles to:
```css
.active-123456 {
  color: red;
}
.button-123456 {
  color: blue;
}
```
When you use it:
```javascript
<button className={sheet.classes.button}>Button</button>
```
It renders to:
```html
<button class="button-123456 active-123456 btn btn-primary">Button</button>
```


## Issues

File a bug against [cssinjs/jss prefixed with \[jss-compose\]](https://github.com/cssinjs/jss/issues/new?title=[jss-compose]%20).

## Run tests

```bash
npm i
npm run test
```

## License

MIT

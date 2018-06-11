# html-custom-element

> HTML5 Custom Element Wrapper (IE11/Chrome/Safari/FF compatible)

## Install
```
$ npm install html-custom-element --save-dev
```

## Usage
```
import {HTMLCustomElement} from 'html-custom-element';

const template = `
  <div on-click="foo" class="hello-ce">
    <h3>Hello {{world}}.</h3>
    Click me to fire CustomEvent \`foo\`;
  </div>`;

const css = `
@keyframes {
  blah;
}
.hello-ce { 
  display: inline-block;
  min-width: 100px; 
  height: 100px;
  background: blue;
  color: #fff
}`; 

export class HelloCustomElement extends HTMLCustomElement {
  init() {
    this.template = template;
    this.css = css;
  }

  foo() {
    alert('foo');
  }
}
HelloCustomElement.define('hello-custom-element', HelloCustomElement);
```

## For Developer

``` bash
# install dependencies
npm install
# serve with hot reload at localhost:8080
npm start
# build for production with minification
npm run build
```

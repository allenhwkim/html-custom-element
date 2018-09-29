# html-custom-element

> HTML5 Custom Element Wrapper (IE11/Chrome/Safari/FF compatible)

![image](https://user-images.githubusercontent.com/1437734/46240499-8fbebf00-c376-11e8-9c59-04f7a6b3469d.png) ![image](https://user-images.githubusercontent.com/1437734/46240506-a8c77000-c376-11e8-9e89-a410ce0563ff.png) ![image](https://user-images.githubusercontent.com/1437734/46240509-b54bc880-c376-11e8-98ea-52a708780d2f.png) ![image](https://user-images.githubusercontent.com/1437734/46240513-bf6dc700-c376-11e8-9f9d-2c70a7b22aa7.png)

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

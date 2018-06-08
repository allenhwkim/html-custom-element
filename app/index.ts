import {HTMLCustomElement} from 'html-custom-element';

const template = `
  <div on-click="foo" class="hello-ce">
    Hello {{world}}
  </div>`;
const css = `
@keyframes {
  blah;
}
.hello-ce { 
  width: 100px; 
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
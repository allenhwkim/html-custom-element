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
  connectedCallback() {
    this.template = template;
    this.css = css;
    this.render();
  }

  foo() {
    alert('foo');
  }
}
HelloCustomElement.define('hello-custom-element', HelloCustomElement);

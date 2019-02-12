import { HTMLCustomElement, createCustomEvent } from '../src';

const template = `
  <div class="hello-ce session-indicator"
    on-hover="xxxxxx"
    on-click="foo">
    <h3>Hello {{world}}.</h3>
    number: {{myNumber}}<br/> 
    boolean: {{myBoolean}} <br/>
    <button class="hello-custom-element">Click me to fire \`hello-event\`</button><br/>
    i18n: {{i18n.translation}}
  </div>`;

const css = `
  @keyframes { blah; }
  h3 {margin: 0}
  .hello-ce { padding: 4px; min-width: 100px; background: blue; color: #fff }
`; 

class HelloCustomElement extends HTMLCustomElement {
  connectedCallback() {
    this.i18n= {translation: "i18n"};
    this.renderWith(template, css).then(el => console.log('render done', el))
  }

  foo(event) {
    const myEvent = createCustomEvent('hello-event', {bubbles: true, detail: 'hello event' });
    this.dispatchEvent(myEvent);
  }
}

HTMLCustomElement.define('hello-custom-element', HelloCustomElement);
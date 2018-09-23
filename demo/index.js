import {HTMLCustomElement, createCustomEvent} from '../src';

const template = `
  <!-- session-indicator is to test something unexpected one -->
  <!-- on-hover="xxxxxx" is to test unbindable event function -->
  <div class="hello-ce session-indicator"
    on-hover="xxxxxx"
    on-click="foo">
    <h3>Hello {{world}}.</h3>
    Click me to fire CustomEvent \`my-custom-event\`;
    <br/>
    translation: {{i18n.translation}}
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
    this.i18n= {translation: "Internationalization"};
    this.renderWith(template, css).then(el => {
      console.log('render done', el);
    })
  }

  foo() {
    const myEvent = createCustomEvent('my-custom-event', {
      bubbles: true,
      detail: 'custom event contents' 
    });
    this.dispatchEvent(myEvent);
  }
}

HelloCustomElement.define('hello-custom-element', HelloCustomElement);

document.body.addEventListener('my-custom-event', event => {
  document.querySelector('#message').innerHTML = 'custom event from ' +
    event.target.getAttribute('world');
});

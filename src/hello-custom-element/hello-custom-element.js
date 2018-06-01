// import '../custom-element-polyfill.js';
import util from '../util';
const template = require('./hello-custom-element.html');

class HelloCustomElement extends HTMLElement {
  connectedCallback() {
    console.dir('connectedCallback', this);
    console.log('connectedCallback', this.world, this.message);
    util.setPropsFromAttrs.bind(this)();    // 1st
    util.setInnerHTML.bind(this)(template); // 2nd
    util.setEventsFromAttrs.bind(this)();   // 3rd
  }

  updateMessage(message) {
    const msgEl = this.querySelector('.message');
    msgEl.innerHTML = message;
    msgEl.classList.remove('yellowfade');
    setTimeout(_ => msgEl.classList.add('yellowfade'));
  }

  runNgFunc(e) {
    this.ngFunc();
  }

  fireMyEvent(e) {
    this.dispatchEvent(new CustomEvent('my-event', {
      bubbles: true, detail: new Date()
    }));
  }

}
customElements.define('hello-custom-element', HelloCustomElement);
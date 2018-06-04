import {HTMLCustomElement} from '../html-custom-element';

const template = require('./hello-custom-element.html');
const css = require('./hello-custom-element.scss');

export class HelloCustomElement extends HTMLCustomElement {
  init() {
    this.template = template;
    this.css = css;
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

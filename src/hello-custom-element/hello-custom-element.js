// import '../custom-element-polyfill.js';
import util from '../util';

const template = require('./hello-custom-element.html');

// private variables
function __addEventListener() {
  this.querySelector('.fire-event').
    addEventListener('click', e => {
      this.dispatchEvent(new CustomEvent('my-event', {
        bubbles: true, detail: new Date()
      }));
    });
  this.querySelector('.run-ng-func').
    addEventListener('click', this.runNgFunc.bind(this));
}

class HelloCustomElement extends HTMLElement {
  connectedCallback() {
    util.setPropsFromAttrs.bind(this)();    // 1st
    util.setInnerHTML.bind(this)(template); // 2nd
    util.setEventsFromAttrs.bind(this)();   // 3rd
  }

  updateMessage(message) {
    this.querySelector('.message').innerHTML = message;
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
// import '../custom-element-polyfill.js';
import Mustache from 'mustache';
import util from '../util';

/**
 * Requirements
 *  - Accept Angular 1 function as an attribute
 *  - Accept Angular 5 function as an attribute
 *  - Fire Event
 */
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
    this.options = util.attrs2Options(this.attributes);
    console.log('this.options', this.options);
    this.innerHTML = Mustache.to_html(template, this.options);
    __addEventListener.bind(this)();
  }

  updateMessage(message) {
    this.querySelector('.message').innerHTML = message;
  }

  runNgFunc(e) {
    this.options.ngFunc();
  }
}
customElements.define('hello-custom-element', HelloCustomElement);
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
  this.querySelector('.fire-event').addEventListener('click', e => {
    this.dispatchEvent(new CustomEvent('my-event', {
      bubbles: true, detail: new Date()
    }));
  });
}

class HelloCustomElement extends HTMLElement {
  connectedCallback() {
    this.options = util.attrs2Options(this.attributes);
    this.innerHTML = Mustache.to_html(template, this.options);
    this.setAttribute('custom-element', '');
    __addEventListener.bind(this)();
  }

  updateNotice(notice) {
    this.querySelector('.notice-msg').innerHTML = notice;
  }

}
customElements.define('hello-custom-element', HelloCustomElement);
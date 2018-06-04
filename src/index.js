import 'document-register-element';

import { util } from './util.js'; // run CustomEvent polyfill
import { HelloCustomElement } from './hello-custom-element/hello-custom-element.js';
import { HelloClock } from './hello-clock/hello-clock.js';

export const CustomElements = {
  define: function() {
    customElements.define('hello-clock', HelloClock);
    customElements.define('hello-custom-element', HelloCustomElement);
  }
}

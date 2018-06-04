import 'document-register-element';

import { util } from './util.js'; // run CustomEvent polyfill
import { HelloCustomElement } from './hello-custom-element/hello-custom-element.js';
import { HelloClock } from './hello-clock/hello-clock.js';

// For SPA, which calls the same js many times
function defineIfNotDefined(name, klass) {
  !customElements.get(name) && customElements(name, klass);
}

export const CustomElements = {
  define: function() {
    defineIfNotDefined('hello-clock', HelloClock);
    defineIfNotDefined('hello-custom-element', HelloCustomElement);
  }
}

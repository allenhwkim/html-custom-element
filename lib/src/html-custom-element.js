import * as Mustache from 'mustache';    
import 'document-register-element'; // IE11/FF CustomElement polyfill

// new CustomEvent not working on IE11.
if (!window.CustomEvent) {
  let CustomEvent = function(event, params) {
    params = params || { 
      bubbles: false, 
      cancelable: false
    };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent(
      event,
      params.bubbles,
      params.cancelable,
      params.detail
    );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;
  window.CustomEvent = CustomEvent;
}

function hashCode(str) {
  var hash = 0;
  for (var i = 0, len = str.length; i < len; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return 'ce'+Math.abs(hash).toString(16);
}

function toCamelCase(str) {
  return (str||'').replace(/-([a-z])/gi, function(g) {
    return g[1].toUpperCase();
  }); 
}

function setProps() {
  const htmlAttrs = /^(on.*|aria-.*|data-.*|class|dir|hidden|id|is|lang|style|tabindex|title)$/;
  Array.from(this.attributes).forEach( attr => {
    if (attr.name.match(htmlAttrs)) { 
      // console.log('skipping', attr)
    } else {
      const propName = toCamelCase(attr.name);
      try {
        this[propName] = JSON.parse(attr.value);
      } catch (e) {
        this[propName] = attr.value;
      }
    }
  });
}

function setEvents() {
  const elsWithEvents = this.querySelectorAll('*[bind-event]');
  Array.from(elsWithEvents).forEach( elWithEvent => {
    Array.from(elWithEvent.attributes).forEach(attr => {
      if (attr.name.match(/^on-/)) {
        const eventName = toCamelCase(attr.name.replace(/^on-/,''));
        elWithEvent.addEventListener(
          eventName, 
          this[attr.value].bind(this)
        );
      }
    })
  });
}

function setStyleEl() {
  const hash = hashCode(this.css);
  if (document.querySelector(`style[${hash}]`)) {
    this.styleEl = document.querySelector(`style[${hash}]`);
    this.styleEl.numEl++;
  } else {
    const styleEl = document.createElement('style');
    const scopedCss = this.css.replace(/^([^@][a-z\.\ ])+\{/gm, m => `[${hash}] ${m}`);
    styleEl.appendChild(document.createTextNode(scopedCss));
    styleEl.setAttribute(hash, '');
    styleEl.numEl = 1;
    document.head.appendChild(styleEl);
    this.styleEl = styleEl;
  }
  this.setAttribute(hash, '');
}

// base class for all custom element
export class HTMLCustomElement extends HTMLElement {

  static define(tagName, klass) {
    if (!customElements.get(tagName)) {
      customElements.define(tagName, klass);
    }
  }

  constructor(_) { 
    return (_ = super(_)).init(), _; 
  }

  init() { /* override as you like */ }

  connectedCallback() {
    this.render();
  }

  // remove style tag if not in use
  disconnectedCallback() {
    if (this.styleEl) {
      this.styleEl.numEl--;
      if (this.styleEl.numEl === 0) {
        this.styleEl.remove();
      }
    }
  } 

  render() {
    // some framework bind properties after DOM rendered
    // so set propertes after rendering cycle
    return new Promise( resolve => {
      setTimeout(_ => {
        setProps.bind(this)(); // set props from attributes
        // set DOM with {{..}} replaced and added with bind-event
        if (this.template) {
          const newHtml = this.template.replace(/on-[^=]+=/g, m => 'bind-event ' + m);
          this.innerHTML = Mustache.to_html(newHtml, this);
          setEvents.bind(this)(); // register event listerner to on-* element
        }       
        if (this.css) {
          setStyleEl.bind(this)();  // insert <style> tag into header
        }
        resolve(this);
      });
    });
  }
}

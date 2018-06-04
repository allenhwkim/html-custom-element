import Mustache from 'mustache';

// new CustomEvent not working on IE11.
(function () {
  if ( typeof window.CustomEvent === "function" ) return false;

  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;
  window.CustomEvent = CustomEvent;
})();

function hashCode(str) {
  var hash = 0;
  for (var i = 0, len = str.length; i < len; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return 'ce'+Math.abs(hash).toString(16);
}

function toCamelCase(str) {
  return str.replace(/-([mce-z])/gi, function(g) {
    return g[1].toUpperCase();
  }); 
}

function setProps() {
  Array.from(this.attributes).forEach( attr => {
    if (!attr.name.match(/^on-/)) {
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
        elWithEvent.addEventListener(eventName, this[attr.value].bind(this));
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
    const scopedCss = this.css.replace(/^([^\ ]+)/gm, m => `${m}[${hash}]`);
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
  constructor(self) { 
    self = super(self);
    self.init();
    return self;
  }

  init() { /* override as you like */ }

  connectedCallback() {
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
  }

  disconnectedCallback() {
    if (this.styleEl) {
      this.styleEl.numEl--;
      if (this.styleEl.numEl === 0) {
        this.styleEl.remove();
      }
    }
  } 
}
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

function getStyleEl(css) {
  const hash = hashCode(css);
  const scopedCss = css.replace(/^([^@][a-z\.\ ])+\{/gm, m => `[${hash}] ${m}`);

  let styleEl = document.querySelector(`style#${hash}`);
  if (styleEl) {
    styleEl.numEl++;
  } else {
    styleEl = document.createElement('style');
    styleEl.appendChild(document.createTextNode(scopedCss));
    styleEl.setAttribute('id', hash);
    styleEl.numEl = 1;
    document.head.appendChild(styleEl);
  }

  return styleEl;
}

function getPropsFromAttributes(el) {
  const htmlAttrs = /^(on.*|aria-.*|data-.*|class|dir|hidden|id|is|lang|style|tabindex|title)$/;
  const props = {};

  Array.from(el.attributes).forEach( attr => {
    if (!attr.name.match(htmlAttrs)) {  // ignore html common attributes
      const propName = toCamelCase(attr.name);
      if (!el[propName]) {       // ignore if property already assigned
        try {
          props[propName] = JSON.parse(attr.value);
        } catch (e) {
          props[propName] = attr.value;
        }
      }
    }
  });
  return props;
}

/**
 * add event listener that has on-* attribute
 */
function setEventsWithOnAttributes(el) {
  const elsWithEvents = el.querySelectorAll('*[bind-event]');
  Array.from(elsWithEvents).forEach( elWithEvent => {
    Array.from(elWithEvent.attributes).forEach(attr => {
      if (attr.name.match(/^on-/)) {
        const eventName = toCamelCase(attr.name.replace(/^on-/,''));
        if (el[attr.value]) {
          elWithEvent.addEventListener(eventName, el[attr.value].bind(el));
        } else {
          console.info(`[html-custom-element] ${attr.name} callback not defined`, el.tagName);
        }
      }
    })
  });
}

// base class for all custom element
export class HTMLCustomElement extends HTMLElement {

  // Do NOT use constructor, buggy on several browsers, FF, IE, Chrome
  // constructor(_) {  return (_ = super(_)).init(), _; }
  // init() { /* override as you like */ }

  static define(tagName, klass) {
    if (!customElements.get(tagName)) {
      customElements.define(tagName, klass);
    }
  }

  /**
   * some framework bind properties after DOM rendered
   * so set propertes after rendering cycle
   */
  disconnectedCallback() {
    if (this.styleEl) {
      this.styleEl.numEl--;
      if (this.styleEl.numEl === 0) {
        this.styleEl.remove();
      }
    }
  } 
  
  /**
   * some framework bind properties after DOM rendered
   * so set propertes after rendering cycle
   */
  renderWith(template, css) {
    return new Promise( resolve => {
      setTimeout(_ => {
        const props = getPropsFromAttributes(this); // user-defined attributes
        for (var prop in props) {
          this[prop] = props[prop];
        }

        if (template) {
          // set DOM with {{..}} replaced and added with bind-event
          const newHtml = template.replace(/ on-[^\ =]+=/g, m => ' bind-event' + m);
          this.innerHTML = Mustache.to_html(newHtml, this);

          setEventsWithOnAttributes(this); // register event listerner to on-* element
        }       

        if (css) {
          this.styleEl = getStyleEl(css);  // insert <style> tag into header
          this.setAttribute(this.styleEl.id, ''); // set attribute, e.g., g9k02js84, for stying
        }

        resolve(this);
      });
    });
  }

  render() { 
    return this.renderWith(this.template, this.css);
  }

}

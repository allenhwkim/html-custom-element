import 'document-register-element'; // IE11/FF CustomElement polyfill
import { OneWayBinding, bindExpressions, bindEvents } from './one-way-binding';

export function setStyleEl(css) {
  function hashCode(str) {
    var hash = 0;
    for (var i = 0, len = str.length; i < len; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash = hash & hash;
    }
    return 'hce'+Math.abs(hash).toString(16);
  }

  const hash = hashCode(css);
  const scopedCss = css.replace(/\s?([^@][\:\>\*\~\[\]\-\(\)a-z\.\ ])+?\{/gm, m => {
    return `\n\.${hash} ${m.trim()}`.replace(/\s*:root/g, '');
  });

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

export function getPropsFromAttributes(el) {
  function toCamelCase(str) {
    return str.replace(/-([a-z])/gi, function(g) {
      return g[1].toUpperCase();
    }); 
  }

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
      } else {
        // do nothing 
      }
    }
  });
  return props;
}

// base class for all custom element
export class HTMLCustomElement extends HTMLElement {

  static define(tagName, klass) {
    !customElements.get(tagName) && customElements.define(tagName, klass);
  }

  /* istanbul ignore next */
  disconnectedCallback() {
    if (this.styleEl) {
      this.styleEl.numEl--;
      (!this.styleEl.numEl) && this.styleEl.remove();
    }
  } 

  /* istanbul ignore next */
  renderWith(template, css, customCss) {
    this.classList.add('hce');
    return new Promise( resolve => {
      // some framework bind properties after DOM rendered
      // so set propertes after rendering cycle
      setTimeout(_ => {
        const props = getPropsFromAttributes(this); // user-defined attributes
        for (var prop in props) { 
          // TODO set properties using dyn. getter and setters
          // e.g. https://gist.github.com/patrickgalbraith/9538b85546b4e3841864
          this[prop] = props[prop];
        }

        if (template) {
          if (template.indexOf('<hce-content></hce-content>')) {
            template = template.replace(/<hce-content><\/hce-content>/, this.innerHTML);
          }
          this.binding = new OneWayBinding(template);
          this.innerHTML = this.binding.newHtml;;

          this.binding.setBindingDOMElements(this); //  from hash x7c5a, to DOM element
          this.detectChanges();
          bindEvents(this, this.binding.events);
        }       

        if (css) {
          this.styleEl = setStyleEl(css);  // insert <style> tag into header
          this.classList.add(this.styleEl.id); // set attribute, e.g., g9k02js84, for stying
          if (customCss) {
            this.styleEl.appendChild(document.createTextNode(customCss));
          }
        }

        resolve(this);
      });
    }); 
  }

  /* istanbul ignore next */
  detectChanges() {
    bindExpressions(this, this.binding.expressions);
  }

}

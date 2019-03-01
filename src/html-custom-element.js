import 'document-register-element'; // IE11/FF CustomElement polyfill
import {OneWayBinding, bindExpressions, bindEvents} from './one-way-binding';

export function setStyleEl(css) {
  function hashCode(str) {
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash = hash & hash;
    }
    return 'hce' + Math.abs(hash).toString(16);
  }

  css = css.replace(/,\s*?[\r\n]\s*?/gm, ', ');
  const hash = hashCode(css);
  const scopedCss = css.replace(/\s?([^@][\:\>\*\~\[\]\-\(\)a-z\.\, ])+\{/gm, (m) => {
    const selectors = m.split(/,\s*/).map((str) => `.${hash} ${str}`.replace(/\s*:root/g, ''));
    return `\n${selectors.join(', ')}`;
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

  // following is the list of default attributes for all html tags, which shouldn't be treated as custom.
  const htmlAttrs = /^(on.*|aria-.*|data-.*|class|dir|hidden|id|is|lang|style|tabindex|title)$/;
  const props = {};

  // TODO: get properties from the close hce element by searching '.hce'
  // so that properties can be inherited to the child attributes
  const parentHCE = el.closest('.hce');
  if (parentHCE) {
    parentHCE.hcePropKeys.forEach((propKey) => props[propKey] = parentHCE[propKey]);
  }

  Array.from(el.attributes).forEach( (attr) => {
    if (!attr.name.match(htmlAttrs)) { // ignore html common attributes
      const propName = attr.name.match(/^\(.*\)$/) ? attr.name : toCamelCase(attr.name);
      if (!el[propName]) { // ignore if property already assigned
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

export function bindEvent(el, eventName, expression) {
  eventName = eventName.replace(/[\(\)]/g, '');
  const [matches, $1, $2] = expression.match(/^(\w+)(\(*.*?\))?$/);
  const funcName = $1; let args = [];

  const argStr = ($2||'').replace(/[()]/g, '') || 'event';
  args = argStr.split(',').map((el) => {
    const arg = el.trim();
    if (arg === 'event') return 'event';
    else if (arg.match(/^[\-\.0-9]/)) return arg; // number
    else if (arg.match(/^(true|false)$/)) return arg; // boolean
    else if (arg.match(/^['"].*['"]$/)) return arg; // string
    else return `this.${arg}`;
  });

  const func = new Function('event', `return ${funcName}(${args.join(',')})`);

  el.addEventListener(eventName, func.bind(el));
}

export function bindExpression(el, propName, expression) {
  propName = propName.replace(/[\[\]]/g, '');
  const func = new Function(`return ${expression};`);
  try {
    el[propName] = func();
  } catch (e) {
    console.log(`Invalid expression, "${expression}" ${e.message}`);
  }
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
    return new Promise( (resolve) => {
      // some framework bind properties after DOM rendered
      // so set propertes after rendering cycle
      setTimeout((_) => {
        const props = getPropsFromAttributes(this); // user-defined attributes
        this.hcePropKeys = Object.keys(props);
        for (const prop in props) {
          if (prop.match(/^\[.*\]$/)) { // e.g. [prop]="expression"
            bindExpression(this, prop, props[prop]);
          } else if (prop.match(/^\(.*\)$/) && props[prop]) {
            bindEvent(this, prop, props[prop]);
          } else {
            // e.g. set properties using setters https://gist.github.com/patrickgalbraith/9538b85546b4e3841864
            this[prop] = props[prop];
          }
        }

        if (template) {
          if (template.indexOf('<hce-content></hce-content>')) {
            template = template.replace(/<hce-content><\/hce-content>/, this.innerHTML);
          }
          this.binding = new OneWayBinding(template);
          this.innerHTML = this.binding.newHtml; ;

          this.binding.setBindingDOMElements(this); //  from hash x7c5a, to DOM element
          this.detectChanges();
          bindEvents(this, this.binding.events);
        }

        if (css) {
          this.styleEl = setStyleEl(css); // insert <style> tag into header
          this.classList.add(this.styleEl.id); // set attribute, e.g., g9k02js84, for stying
          if (customCss) {
            this.styleEl.appendChild(document.createTextNode(customCss));
          }
        }

        // adding this at the end so that this.closest('.hce') does not include itself
        this.classList.add('hce');
        resolve(this);
      });
    });
  }

  /* istanbul ignore next */
  detectChanges() {
    bindExpressions(this, this.binding.expressions);
  }

  /* istanbul ignore next */
  disappear() {
    const compStyle = window.getComputedStyle(this);
    (compStyle.transitionDuration === '0s') && (this.style.transition = 'all .3s linear');
    this.displayStyle = compStyle.display;
    this.style.opacity = 0;
    setTimeout((_) => this.style.display = 'none', 330);
  }

  /* istanbul ignore next */
  appear(as) {
    const compStyle = window.getComputedStyle(this);
    (compStyle.transitionDuration === '0s') && (this.style.transition = 'all .3s linear');
    this.style.display = as || this.displayStyle || 'block';
    this.style.opacity = 0;
    setTimeout((_) => this.style.opacity = 1, 20);
  }
}

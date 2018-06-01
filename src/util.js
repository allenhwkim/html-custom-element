import Mustache from 'mustache';

function toCamelCase(str) {
  return str.replace(/-([mce-z])/gi, function(g) {
    return g[1].toUpperCase();
  }); 
}

function observeAttrsChange(el, callback) {
  var observer = new MutationObserver( function(mutations) {
    mutations.forEach(mutation => {
      if (mutation.type === 'attributes') {
        let newVal = mutation.target.getAttribute(mutation.attributeName);
        callback(mutation.attributeName, newVal);
      }
    });
  });
  observer.observe(el, {attributes: true});
  return observer;
}

function setTabbable(el, fn) {
  if (el.getAttribute('tabindex')) {
    el.addEventListener('keypress', function(event) {
      if (event.key === ' ' || event.key === 'Enter') {
        fn && fn();
        event.preventDefault();
      }
    });
  }
}

function setPropsFromAttrs() {
  Array.from(this.attributes).forEach( attr => {
    if (!attr.name.match(/^on-/)) {
      const propName = toCamelCase(attr.name);
      try {
        this[propName] = JSON.parse(attr.value);
      } catch (e) {
        this[propName] = attr.value;
      }
    }
    console.log('attribute', attr, 'this', this);
  });
}

function setEventsFromAttrs() {
  const elsWithEvents = this.querySelectorAll('*[bind-event]');
  Array.from(elsWithEvents).forEach( el => {
    const eventAttrs = 
      Array.from(el.attributes).filter(attr => attr.name.match(/^on-/));
    eventAttrs.forEach(attr => {
      const eventName = toCamelCase(attr.name.replace(/^on-/,''));
      el.addEventListener(eventName, this[attr.value].bind(this));
      console.log('el', el, 'event', eventName, 'listener', this[attr.value].bind(this));
    })
  });
}

function setInnerHTML(template) {
  console.log('setInnerHTML template', template);
  const template2 = template.replace(/on-[^=]+=/g, m => 'bind-event ' + m);
  console.log('setInnerHTML template2', template2, this);
  this.innerHTML = Mustache.to_html(template2, this);
}

const util = {
  setPropsFromAttrs,
  setEventsFromAttrs,
  setInnerHTML,
  observeAttrsChange, 
  setTabbable
}

export default util;
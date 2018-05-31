function toCamelCase(str) {
  return str.replace(/-([mce-z])/gi, function(g) {
    return g[1].toUpperCase();
  }); 
}

/**
 * window.foo = {
 *   bar: {
 *     a: {
 *       b: {
 *         'c-end': 'hello'
 *       }
 *     }
 *   }
 * }
 * 
 * console.log(str2Obj("foo.bar.a.b['c-end']"))
 * console.log(str2Obj(`foo['bar'].a["b"]['c-end']`))
 * console.log(str2Obj(`bar.a["b"]['c-end']`, foo))
 * console.log(str2Obj(`foo['error'].a["b"].c`, window, true))// 
 */
function str2Val(str, scope=window) {
  const keys = str.split(/[\.\[\]'"]/).filter(e => e);
  let ret = scope;
  
  try {
    keys.forEach(function(key) {
      ret = ret[key];
    });
    return ret;
  } catch(e) {
    return undefined;
  }
}

/**
 * Observe attribute change and execute the given callback
 * @example
 *   observeAttrsChange(el, (attr, val) => {
 *     if (attr === 'foo') {
 *       console.log('attribute', attr, 'is changed to', val);
 *     }
 *   }); 
 */
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

/** 
 * set the given element tabbable by adding tabindex, and click/ENTER event
 * @example
 *   setTabbable(el, _ => this.inputEl.click());
 */
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

/**
 * returns options and events from attributes
 */
function attrs2Options(attributes) {
  const options = {};

  Array.from(attributes).forEach( function(attr) {
    const optionName = toCamelCase(attr.name);
    if (attr.value.match(/[\.\[\]]/)) {
      options[optionName] = str2Val(attr.value);
    } else {
      options[optionName] = attr.value;
    }
  });

  return options;
}

const util = {
  str2Val, observeAttrsChange, setTabbable, attrs2Options
}

export default util;
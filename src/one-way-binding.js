/**
 *
 * Find new value of expressions in custom element, and set html, attribute, or property
 *
 * example of expression
 * {
 *   expression: 'hero.name',
 *   value: 'new value',
 *   bindings: [
 *     {el: <span>, type: 'innerHTML', attrName: 'foo', propName: 'hidden'}
 *   ]
 * },
 */
export function bindExpressions(custEl, expressions) {
  // loop through expressions and compare the value of expression
  expressions.forEach((expr) => {
    const func = new Function(`return this.${expr.expression};`);
    const newValue = func.bind(custEl)();

    // if value of expression is different from previous value
    if ( expr.value !== newValue) {
      // console.log(
      //   `expression "${expr.expression}" value is changed to "${newValue}"`,
      //   `binding it to`,
      //   expr.bindings.map(_ => _.el)
      // );
      expr.value = newValue || '';

      // replace value html, attribute, or property with new value
      expr.bindings.forEach((binding) => {
        switch (binding.type) {
          case 'innerHTML':
            const innerHTML = typeof newValue === 'undefined' ? '' : newValue;
            binding.el.innerHTML = `${innerHTML}`;
            break;
          case 'attribute':
            binding.el.setAttribute(binding.attrName, newValue);
            break;
          case 'property':
            binding.el[binding.propName] = newValue;
            break;
        }
      });
    }
  });
}

/**
 *
 *  Add event listener to each element
 *
 * example of event
 * {
 *   el: <span>,
 *   bindings: [
 *     {eventName: 'click', funcName: 'foo', args: ['event', 'this.x'..] }
 *   ]
 * },
 */
export function bindEvents(el, events) { // el - custom element
  events.forEach((eventBinding) => {
    const bindingEl = eventBinding.el;
    eventBinding.bindings.forEach((binding) => {
      const func = new Function(
          'event',
          `return ${binding.funcName}(${binding.args.join(',')})`
      );

      bindingEl.addEventListener(binding.eventName, func.bind(el));
    });
  });
}


/**
 *
 * One way binding helper for an element
 * Parse the given html and prepare expressions, events, and converted html
 *
 *  expressions:
 *    1. interpolation e.g. <span>{{hello.name}}</span>
 *    2. attribute name with bracket e.g. <foo [propName]="foo.bar">
 *    3. attribute value with interpolation e.g. <foo title="{{hello.name}}"}">
 *
 *  events:
 *    1. attribute name with round bracketg e.g. <foo (click)="doSomething(e)">
 *
 * @param html        html string
 *
 * @props newHtml     newly replaced html for bindings ready
 * @props expressions expressions binding table
 * @props events      event bindigs table
 *
 * @usage
 *   import {OnewayBinding, bindExpressions, bindEvents} from 'one-way-binding';
 *   const binding = new OneWayBinding(html);
 *   console.log(
 *     binding.newHtml,     // array
 *     binding.expressions, // array
 *     binding.events       // array
 *   );
 *
 *   // Within in custom element
 *   bindExpressions(el, binding.expressions);
 *   bindEvents(el, binding.events)
 */
export class OneWayBinding {
  constructor(html) {
    this.expressions = [];
    this.events = [];
    this.html = html;
    this.newHtml = this.__getNewHtml();
  }

  setBindingDOMElements(el) {
    const selectors = [];

    this.expressions.forEach((expr) => {
      expr.bindings.forEach((binding) => {
        selectors.push(binding.el);
        binding.el = el.querySelector(`[${binding.el}]`);
      });
    });

    this.events.forEach((evt) => {
      selectors.push(evt.el);
      evt.el = el.querySelector(`[${evt.el}]`);
    });

    selectors.forEach((hash) => {
      const elWithHash = el.querySelector(`[${hash}]`);
      elWithHash && elWithHash.removeAttribute(hash);
    });
  }

  __setExprBindings(expression, value) {
    const expr = this.expressions.find((el) => el.expression === expression);
    if (expr) {
      expr.bindings.push(value);
    } else {
      this.expressions.push({expression, value: null, bindings: [value]});
    }
  }

  __getNewHtml() {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(this.html, 'text/html');
    this.__runChildren(htmlDoc.body);
    this.__replaceBINDToSPAN(htmlDoc);
    return htmlDoc.body.innerHTML;
  }

  __eventParsed(str) {
    const [match, _1, _2] = str.match(/^(\w+)(\(*.*?\))?$/);
    if (match) {
      const funcName = `this.${_1}`;
      const argStr = (_2||'').replace(/[()]/g, '') || 'event';
      const args = argStr.split(',').map((el) => {
        const arg = el.trim();
        if (arg === 'event') return 'event';
        else if (arg.match(/^[\-\.0-9]/)) return arg; // number
        else if (arg.match(/^(true|false)$/)) return arg; // boolean
        else if (arg.match(/^['"].*['"]$/)) return arg; // string
        else return `this.${arg}`;
      });
      return [funcName, args];
    }
  }

  __runChildren(node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      this.__bindElement(node);
    } else if (node.nodeType === Node.TEXT_NODE) {
      if (node.nodeValue.match(/{{(.*?)}}/)) {
        this.__bindInnerHTML(node);
      }
    }

    const childNodes = node.childNodes;
    for (let i = 0; i < childNodes.length; i++) {
      const childNode = childNodes[i];
      if (childNode.hasAttribute && childNode.hasAttribute('ce-no-bind')) {
        console.log('found ce-no-bind. skipping binding');
      } else if (childNode.childNodes) {
        this.__runChildren(childNode);
      }
    }
  }

  __bindElement(el) {
    for (let i=0; i < el.attributes.length; i++) {
      const attr = el.attributes[i];

      attr.name.match(/^\[(.*?)\]$/) && this.__bindElementProperty(el, attr);
      attr.value.match(/{{(.*?)}}/) && this.__bindAttribute(el, attr);
      if (attr.name.match(/^\(.*?\)$/) || attr.name.match(/^on-(.*?)/)) {
        this.__bindElementEvent(el, attr);
      }
    }
  }

  __replaceBINDToSPAN(htmlDoc) {
    htmlDoc.body.innerHTML =
      htmlDoc.body.innerHTML.replace(/BIND-(x[\w]+)/g, `<span $1></span>`);
  }

  __getHash() {
    const randNum = Math.random() * (0xffff - 0xfff) + 0xfff;
    return 'x' + Math.floor(randNum).toString(16);
  }

  __bindInnerHTML(node) {
    node.nodeValue = node.nodeValue.replace(/{{(.*?)}}/g, (match, expression) => {
      const hash = this.__getHash();
      this.__setExprBindings(expression, {
        el: hash,
        type: 'innerHTML',
        orgHtml: match,
      });
      // cannot set element SPAN into text node
      // will be changed to SPAN tag later
      return `BIND-${hash}`;
    });
  }

  __bindElementProperty(el, attr) {
    el.bindingHash = el.bindingHash || this.__getHash();
    el.setAttribute(el.bindingHash, '');
    const matches = attr.name.match(/^\[(.*?)\]$/);
    this.__setExprBindings(attr.value, {
      el: el.bindingHash,
      type: 'property',
      propName: matches[1],
      orgHtml: `${attr.name}="${attr.value}"`,
    });
  }

  __bindAttribute(el, attr) {
    el.bindingHash = el.bindingHash || this.__getHash();
    el.setAttribute(el.bindingHash, '');
    const matches = attr.value.match(/{{(.*?)}}/);
    this.__setExprBindings(matches[1], {
      el: el.bindingHash,
      type: 'attribute',
      attrName: attr.name,
      orgHtml: `${attr.name}="${attr.value}"`,
    });
  }


  __bindElementEvent(el, attr) {
    el.bindingHash = el.bindingHash || this.__getHash();
    el.setAttribute(el.bindingHash, '');

    const found = this.events.find((event) => event.el === el.bindingHash);
    if (!found) {
      this.events.push({el: el.bindingHash, bindings: []});
    }

    const event = this.events.find((event) => event.el === el.bindingHash);
    const eventParsed = this.__eventParsed(attr.value);
    if (eventParsed) {
      const [funcName, args] = this.__eventParsed(attr.value);
      let eventName;
      if (attr.name.match(/^\((.*?)\)$/)) {
        eventName = attr.name.match(/^\((.*?)\)$/)[1];
      } else if (attr.name.match(/^on-(.*?)/)) {
        eventName = attr.name.replace('on-', '');
      }

      event.bindings.push({eventName, funcName, args});
    }
  }
}

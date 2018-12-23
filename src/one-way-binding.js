// var validator = require('html-validator');
// validator({data: '<div>', format: 'json'}).then( ..... )
// import {JSDOM} from 'jsdom';
  
  const html=`
    <div class="container">
      <!-- this is comment -->
      <div>
        {{hello}} My current hero is {{currentHero.name}}
        <span> spacing </span>
        My next hero is {{nextHero.name}}
      </div>
      <h3>
        {{hello}}
        {{hello}}
        {{title}}
      </h3>
      <img src="{{heroImageUrl()}}" style="height:30px" />
      <br />
      <span bar="{{hello}}" 
        [hidden]="isUnchanged"
        [foo]="fooValue()">
        changed
      </span>
      <button 
        (click)="deleteHero(event, a, b)" 
        (mouseover)="bar()"
        (mouseout)="foo">
        {{hello}} button
      </button>
    </div>
    `;

/**
 * 
 * One way binding helper for an element
 * 
 * @example
 *   const binding = new OneWayBinding(html);
 *   console.log(
 *     binding.newHtml,
 *     binding.expressions,
 *     binding.events
 *   );
 * 
 *   // Within in custom element
 *   binding.bindExpressions(el);
 *   binding.bindEvents(el)
 * 
 * @param html string
 * @props html original html
 * @props newHtml newly replace html for bindings ready
 * @props expressions expressions binding table
 * @props events event bindigs table
 * 
 * @function getEventHandler(expression) -> event handler function
 */
class OneWayBinding {

  constructor(html) {
    this.expressions = {};
    this.events = {};
    this.html = html;
    this.newHtml = this.__getNewHtml();

  }

  bindExpressions(el) {
    const expressions = this.expressions;
    
    for (var key in expressions) {
      const expression = expressions[key];
      const func = new Function(`return this.${key};`);
      const oldValue = expression.value;
      const newValue = func.bind(el)();

      if (oldVaue !== newVaue) {
        const bindings = expression.bindings;
        expression.value = newValue;

        bindings.forEach(binging => {
          const el = el.querySelector(binding.el);
          switch(binding.type) {
            case 'innerHTML':
              el.innerHTML = `${newValue}`;
              break;
            case 'attribute':
              el.setAttribute(binding.attrName, newValue);
              break;
            case 'property':
              el[binding.propName] = newValue;
              break;
          }
        })
      }
    }
  }

  bindEvents(el) {
    const events = this.events;
    for(var key in events) {
      const el = el.querySelector(key);
      for (var eventName in events[key]) {
        const data = events[key][eventName];
        const func = new Function('event', 
          `return ${data.funcName}(${data.args.join(',')})`
        );
        el.addEventListener(eventName, func.bind(el));
      }
    }
  }

  __setBindings(key, value) {
    this.expressions[key] = 
      this.expressions[key] || { value: null, bindings: [] };
    this.expressions[key].bindings.push(value);
  }

  __getNewHtml() {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(this.html, 'text/html');
    this.__runChildren(htmlDoc.body);
    this.__replaceBINDToSPAN(htmlDoc);
    return htmlDoc.body.innerHTML;
  }
    
  __eventParsed(str) {
    const [_, _1, _2] = str.match(/^(\w+)(\(*.*?\))?$/);
    const funcName = `this.${_1}`;
    const argStr = (_2||'').replace(/[()]/g,'') || 'event';
    const args = argStr.split(',').map(arg => 
      arg.trim() === 'event' ? arg.trim() : `this.${arg.trim()}`
    );
    return [funcName, args];
  }

  __runChildren(node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      this.__bindElement(node);
    } else if (
      node.nodeType === Node.TEXT_NODE && node.nodeValue.match(/{{(.*?)}}/)
    ) {
      this.__bindInnerHTML(node);
    }

    var childNodes = node.childNodes;
    for (var i = 0; i < childNodes.length; i++) {
      const childNode = childNodes[i];
      if (childNode.childNodes) {
        this.__runChildren(childNode);
      }
    }
  }

  __bindElement(el) {
    for (var i=0; i < el.attributes.length; i++) {
      const attr = el.attributes[i];

      attr.name.match(/^\[(.*?)\]$/) && this.__bindElementProperty(el, attr);
      attr.value.match(/{{(.*?)}}/) && this.__bindAttribute(el, attr);
      attr.name.match(/^\(.*?\)$/) && this.__bindElementEvent(el, attr);
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
    node.nodeValue =  node.nodeValue.replace(/{{(.*?)}}/g, (match, expression) => {
      const hash = this.__getHash();
      this.__setBindings(expression, {
        el: `[${hash}]`,
        type: 'innerHTML',
        orgHtml: match
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
    this.__setBindings(attr.value, {
      el: `[${el.bindingHash}]`,
      type: 'property',
      propName: matches[1],
      orgHtml: `${attr.name}="${attr.value}"`
    });
  }

  __bindAttribute(el, attr) {
    el.bindingHash = el.bindingHash || this.__getHash();
    el.setAttribute(el.bindingHash, '');
    const matches = attr.value.match(/{{(.*?)}}/);
    this.__setBindings(matches[1], {
      el: `[${el.bindingHash}]`,
      type: 'attribute',
      attrName: attr.name,
      orgHtml: `${attr.name}="${attr.value}"`
    });
  }

  __bindElementEvent(el, attr) {
    el.bindingHash = el.bindingHash || this.__getHash();
    el.setAttribute(el.bindingHash, '');
    const matches = attr.name.match(/^\((.*?)\)$/);
    this.events[`[${el.bindingHash}]`] = 
      this.events[`[${el.bindingHash}]`] || {};

    const [funcName, args] = this.__eventParsed(attr.value);
    this.events[`[${el.bindingHash}]`][matches[1]] = {
      funcName: funcName,
      args: args,
      orgHtml: `${attr.name}="${attr.value}"`
    }
  }

}

const onewayBinding = new OneWayBinding(html);
document.querySelector('#expressions').innerHTML = 
  JSON.stringify(onewayBinding.expressions, null, '    ');
document.querySelector('#events').innerHTML = 
  JSON.stringify(onewayBinding.events, null, '    ');

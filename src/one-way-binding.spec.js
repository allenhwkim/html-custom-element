import {bindExpressions, bindEvents, OneWayBinding} from './one-way-binding';

describe('#bindExpressions', function () {
  let custEl, el; 

  beforeEach(function () {
    custEl = document.createElement('div');
    custEl.foo = 'bar';
    el = document.createElement('div');
  });

  it('can bind {{ .. }} to element', function () {
    const expressions = [{ expression: 'foo', value: null, bindings: [{el: el, type: 'innerHTML'}] }];
    bindExpressions(custEl, expressions);

    expect(el.innerHTML).toBe('bar');
  });

  it('can bind attribute of element', function () {
    const expressions = [{ expression: 'foo', value: null, bindings: [{el: el, type: 'attribute', attrName: 'foo'}] }];
    bindExpressions(custEl, expressions);

    expect(el.getAttribute('foo')).toBe('bar');
  });

  it('can bind property of element', function () {
    const expressions = [{ expression: 'foo', value: null, bindings: [{el: el, type: 'property', propName: 'foo'}] }];
    bindExpressions(custEl, expressions);

    expect(el.foo).toBe('bar');
  });
});
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
 /*
export function bindEvents(custEl, events) { // el - custom element
  events.forEach(eventBinding => {
    const bindingEl = eventBinding.el;
    eventBinding.bindings.forEach(binding => {

      const func = new Function(
        'event', 
        `return ${binding.funcName}(${binding.args.join(',')})`
      );

      bindingEl.addEventListener(binding.eventName, func.bind(custEl));
    });
  })
}
*/
describe('#bindEvents', function () {



  it('can bind all events', function () {
    const custEl = document.createElement('div');
    const el = document.createElement('div');
    const events = [{el: el, bindings: [
      {eventName: 'click', funcName: 'myFunc', args: ['event', 'this.foo'] }
    ]}];
    custEl.foo = 'bar';
    custEl.myFunc = function(event, str) { 
      this.bar = str;
    }

    const spy = spyOn(el, 'addEventListener');

    bindEvents(custEl, events);

    expect(spy).toHaveBeenCalled();
    // el.simulate('click');
    // expect(el.bar).toBe('bar');
  });
});

describe('OneWayBinding', function () {

  it('#constructor', function () {
    const html = `
      <div>
        <h3> {{hello}} {{world}} {{hero.name}} {{hero.next()}} </h3>
        <span bar="{{hello}}" [current]="hero.current" [next]="hero.next()">attribute</span>
        <button 
          on-click="click(event, hero.name, true)" 
          (click)="click(event, hero.name, true)" 
          (mouseover)="mouseover(event, '')"
          (mouseout)="mouseout">
          <img src="{{hero.img()}}"/>
        </button>

        <div ce-no-bind>{{hello}}</div>
      </div>`;

    const owb = new OneWayBinding(html);
    expect(owb.expressions.length).toBe(6);
    expect(owb.events.length).toBe(1);
    expect(owb.events[0].bindings.length).toBe(4);
  });

  // setBindingDOMElements(el) {
  //   const selectors = [];

  //   this.expressions.forEach(expr => {
  //     expr.bindings.forEach(binding => {
  //       selectors.push(binding.el);
  //       binding.el = el.querySelector(`[${binding.el}]`);
  //     })
  //   });

  //   this.events.forEach(evt => {
  //     selectors.push(evt.el);
  //     evt.el = el.querySelector(`[${evt.el}]`);
  //   });

  //   selectors.forEach(hash => {
  //     const elWithHash = el.querySelector(`[${hash}]`);
  //     elWithHash && elWithHash.removeAttribute(hash);
  //   })
  // }
  it('#setBindingDOMElements', function () {
    const html=`
      <h3> {{hello}}</h3>
      <button (click)="click(event, hero.name, true)">button</button> 
    `;

    const owb = new OneWayBinding(html);
    const el = document.createElement('div');
    el.innerHTML = owb.newHtml;

    owb.setBindingDOMElements(el);
    expect(owb.newHtml.length).toBeGreaterThan(el.innerHTML.length);
  });

});

import {bindExpressions, bindEvents, OneWayBinding} from './one-way-binding';

describe('#bindExpressions', function() {
  let custEl; let el;

  beforeEach(function() {
    custEl = document.createElement('div');
    custEl.foo = 'bar';
    el = document.createElement('div');
  });

  it('can bind {{ .. }} to element', function() {
    const expressions = [{expression: 'foo', value: null, bindings: [{el: el, type: 'innerHTML'}]}];
    bindExpressions(custEl, expressions);

    expect(el.innerHTML).toBe('bar');
  });

  it('can bind attribute of element', function() {
    const expressions = [{expression: 'foo', value: null, bindings: [{el: el, type: 'attribute', attrName: 'foo'}]}];
    bindExpressions(custEl, expressions);

    expect(el.getAttribute('foo')).toBe('bar');
  });

  it('can bind property of element', function() {
    const expressions = [{expression: 'foo', value: null, bindings: [{el: el, type: 'property', propName: 'foo'}]}];
    bindExpressions(custEl, expressions);

    expect(el.foo).toBe('bar');
  });
});

describe('#bindEvents', function() {
  it('can bind all events', function() {
    const custEl = document.createElement('div');
    const el = document.createElement('div');
    const events = [{el: el, bindings: [
      {eventName: 'click', funcName: 'myFunc', args: ['event', 'this.foo']},
    ]}];
    custEl.foo = 'bar';
    custEl.myFunc = function(event, str) {
      this.bar = str;
    };

    const spy = spyOn(el, 'addEventListener');

    bindEvents(custEl, events);

    expect(spy).toHaveBeenCalled();
  });
});

describe('OneWayBinding', function() {
  it('#constructor', function() {
    const html = `
      <div>
        <h3> {{hello}} {{world}} {{hero.name}} {{hero.next()}} </h3>
        <span bar="{{hello}}" [current]="hero.current" [next]="hero.next()">attribute</span>
        <button 
          on-click="click(event, hero.name, true, 123)" 
          (click)="click(event, hero.name, true, 123)" 
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

  it('#setBindingDOMElements', function() {
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

import {HTMLCustomElement, createCustomEvent} from '../src';

const template = `
  <div style="border:1px dashed #ccc">
    <h3> {{hello}} {{world}} {{hero.name}} </h3>
    <!-- this is comment -->
    <div>
      <div> {{hello}} My current hero is {{hero.current}} </div>
      My next hero is {{hero.next()}}
    </div>
    
    <br/>
    <div>
      <span bar="{{hello}}" [current]="hero.current" [next]="hero.next()">
        attribute/property binding test
      </span><br/>
      <button id="one-way-binding"
        (click)="click(event, 'One Way Binding', 'Current Updated')" 
        (mouseover)="mouseover(event, '')"
        (mouseout)="mouseout">
        Click here to see binding changes
        <img src="{{hero.img()}}" style="height:30px" />
      </button>
    <div>

    <br/>
    <div ce-no-bind (click)="click(event)">
      With "ce-no-bind" attribute, one way binding is ignored.
      <div> {{hello}} My current hero is {{hero.current}}. My next hero is {{hero.next()}}</div>
    </div>
  </div>
`;

class OneWayBindCustomElement extends HTMLCustomElement {
  connectedCallback() {
    this.hello;
    this.hero = {
      name: 'HERO',
      current: 'CURRENT',
      next: () => 'NEXT',
      img: () => 'chrome.png',
    };
    this.renderWith(template).then((el) => el);
  }

  mouseout(event) {
    event.target.style.textShadow = 'none';
  }

  mouseover(event, a) {
    event.target.style.textShadow = '0 0 .65px #333, 0 0 .65px';
  }

  click(event, name, current) {
    this.hello = 'Hi';
    this.hero.name = name;
    this.hero.current = current;
    this.hero.next = () => 'Next Hero';
    this.detectChanges();
  }
}

HTMLCustomElement.define('one-way-bind-custom-element', OneWayBindCustomElement);

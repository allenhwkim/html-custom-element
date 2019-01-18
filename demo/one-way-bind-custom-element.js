import { HTMLCustomElement, createCustomEvent } from '../src';

const template = `
  <div>
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
      <button 
        (click)="click(event, hero.name, true)" 
        (mouseover)="mouseover(event, '')"
        (mouseout)="mouseout">
        event binding <img src="{{hero.img()}}" style="height:30px" />
      </button>
    <div>

    <br/>
    <div ce-no-bind (click)="click(event)">
      With "ce-no-bind" attribute, binding does not work.
      <div> {{hello}} My current hero is {{hero.current}}. </div>
      My next hero is {{hero.next()}}
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
      img: () => 'chrome.png'
    };
    this.renderWith(template).then(el => el)
  }

  mouseout(event) {
    console.log(event);
  }

  mouseover(event, a) {
    console.log(a, event);
  }

  click(event, a, b) {
    console.log(a, b, event);
  }

}

HTMLCustomElement.define('one-way-bind-custom-element', OneWayBindCustomElement);
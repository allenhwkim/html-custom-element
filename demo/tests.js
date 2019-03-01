const hce1 = document.querySelectorAll('hello-custom-element')[0];
const hce2 = document.querySelectorAll('hello-custom-element')[1];
const msg = document.querySelector('#message');
const addOne = document.querySelector('#add-one');
const removeOne = document.querySelector('#remove-one');

const owbce = document.querySelector('one-way-bind-custom-element');
export const tests = [
  {name: 'I see "Hello ONE"', func: () => hce1.innerText.match(/Hello ONE/)},
  {name: 'I see "number: 123.456"', func: () => hce1.innerText.match(/number: 123.456/)},
  {name: 'I see "boolean: false"', func: () => hce1.innerText.match(/boolean: false/)},
  {name: 'I see "Click a button to see this message"', func: () => msg.innerText.match(/to see this message/)},
  {name: 'I see message "ONE"', func: () => {
    hce1.querySelector('button').click();
    return msg.innerText.match(/ONE/);
  }},
  {name: 'I see "Hello TWO"', func: () => hce2.innerText.match(/Hello TWO/)},
  {name: 'I see "number: 123.456"', func: () => hce2.innerText.match(/number: 654.321/)},
  {name: 'I see "boolean: true"', func: () => hce2.innerText.match(/boolean: true/)},
  {name: 'I see message "TWO"', func: () => {
    hce2.querySelector('button').click();
    return msg.innerText.match(/TWO/);
  }},
  {name: 'I see more component from when I click \'Add one\' ', func: () => {
    return new Promise((resolve, reject) => {
      document.querySelector('#add-one').click();
      setTimeout(() => {
        const hce3 = document.querySelectorAll('hello-custom-element')[2];
        resolve(hce3.innerText.match(/Hello MORE/));
      });
    });
  }},
  {name: 'I see \'HELLO HERO\'', func: () => owbce.innerText.match(/HELLO HERO/)},
  {name: 'I see \'HELLO My current hero is CURRENT\'', func: () =>
    owbce.innerText.match(/HELLO My current hero is CURRENT/),
  },
  {name: 'I see \'My next hero is NEXT\'', func: () => owbce.innerText.match(/My next hero is NEXT/)},
  {name: 'I see \'{{hello}}\'', func: () => owbce.innerText.match(/{{hello}}/)},
  {name: 'I see \'{{hero.current}}\'', func: () => owbce.innerText.match(/{{hero.current}}/)},
  {name: 'I see \'{{hero.next()}}\'', func: () => owbce.innerText.match(/{{hero.next\(\)}}/)},
  {name: 'Oneway binding test', func: () => {
    return new Promise((resolve, reject) => {
      document.querySelector('#one-way-binding').click();
      setTimeout(() => {
        const result = owbce.innerText.match(/Hi One Way Binding/)
          && owbce.innerText.match(/Hi My current hero is Current Updated/)
          && owbce.innerText.match(/My next hero is Next Hero/);
        resolve(result);
      });
    });
  }},
];
/*
  <li>...............</li>
  <li>I click "Add one", and I see "Hello MORE"</li>
  <li>I see "num style tag with id: 1"</li>
  <li>I click "Remove one" three times</li>
  <li>I see "num style tag with id: 0"</li>
  <li>I click "Add one", and I see "Hello MORE"</li>
  <li>I see "num style tag with id: 1"</li>
  <li>...............</li>
  <li>I see "HELLO HERO"<li>
  <li>I see "HELLO My current hero is CURRENT"</li>
  <li>I see "My next hero is NEXT"</li>
*/

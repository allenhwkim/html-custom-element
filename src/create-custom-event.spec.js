/**
 * IE11 Compatible CustomEvent
 * @example:
 *   const myEvent = createCustomEvent('agent-live-chat', {bubbles: true});
 *   element.dispatchEvent(myEvent);
 */
// export function createCustomEvent(eventName, options) {
//   let event;
//   if (typeof(CustomEvent) === 'function') {
//     event = new CustomEvent(eventName, options);
//   }  else {
//     event = document.createEvent('CustomEvent');
//     event.initCustomEvent(
//       eventName,
//       options.bubbles,
//       options.cancelable,
//       options.detail
//     );
//   }
//   return event;
// }
import {createCustomEvent} from './create-custom-event';

beforeEach(() => {
  // Jest will wait for this promise to resolve before running tests.
});

test('can create a custom event from CustomEvent', () => {
  const evt = createCustomEvent('my-event', {bubbles: true, detail: 'my detail'});

  expect(evt.constructor.name).toBe('CustomEvent');
  expect(evt.detail).toBe('my detail');
  expect(evt.type).toBe('my-event');
});

test('can create a custom event from document.createEvent', () => {
   const savedCustomEvent = global.CustomEvent;
   delete global.CustomEvent;
   const evt = createCustomEvent('my-event', {bubbles: true, detail: 'my detail'});

   expect(evt.constructor.name).toBe('CustomEvent');
   expect(evt.detail).toBe('my detail');
   expect(evt.type).toBe('my-event');

   global.CustomEvent = savedCustomEvent;`` 
});
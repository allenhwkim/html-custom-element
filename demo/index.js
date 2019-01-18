import './hello-custom-element';
import './one-way-bind-custom-element';

document.body.addEventListener('hello-event', event => {
  document.querySelector('#message').innerHTML = 'custom event from ' +
    event.target.getAttribute('world');
});

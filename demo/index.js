import './hello-custom-element';
import './one-way-bind-custom-element';
import {tests} from './tests';

document.body.addEventListener('hello-event', (event) => {
  document.querySelector('#message').innerHTML = 'custom event from ' +
    event.target.getAttribute('world');
});

document.addEventListener('DOMContentLoaded', function(event) {
  console.log('DOM fully loaded and parsed');
  function addResult(result, test) {
    const liEl = document.createElement('li');
    liEl.className = result ? 'success' : 'error';
    liEl.innerHTML = result ? `&#x2713;  ${test.name}` : `&#x2717; ${test.name}`;
    document.querySelector('#test-results').appendChild(liEl);
  }

  setTimeout( () => {
    tests.forEach((test) => {
      let result;
      try {
        result = test.func();
        if (result.then) {
          result.then((ret) => addResult(ret, test));
        } else {
          addResult(result, test);
        }
      } catch (e) {
        console.error(e);
        addResult(false, test);
      }
    });
  });
});

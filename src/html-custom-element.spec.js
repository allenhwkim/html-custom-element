import {setStyleEl, getPropsFromAttributes, HTMLCustomElement} from './html-custom-element';

beforeEach(() => {
  // Jest will wait for this promise to resolve before running tests.
});

test('can set head style element with id', () => {
  const css = `.my-class {color: red; }`
  const styleEl = setStyleEl(css);

  expect(styleEl.numEl).toBe(1);
  expect(styleEl.id).toMatch(/^hce/);
  expect(document.querySelectorAll('style').length).toBe(1);

  setStyleEl(css); // set style multiple times

  expect(styleEl.numEl).toBe(2);
  expect(document.querySelectorAll('style').length).toBe(1);
});


test('can get props from attributes', () => {
  document.body.insertAdjacentHTML('beforeend', `
    <hello-custom-element
      onclick="alert('ignore this binding')"
      class="ignore this binding"
      aria-text="ignore this binding"
      data-x="ignore this binding"
      dir="ignore this binding"
      style="border: transparent;"
      hidden="ignore this binding"
      id="ignore-this"
      lang="ignore this binding"
      title="ignore this bind"
      tabindex="1"
      world="ONE"
      my-number="123.456"
      my-boolean="false">
    </hello-custom-element>`);
  const el = document.querySelector('hello-custom-element');

  const props = getPropsFromAttributes(el);

  expect(props.world).toBe('ONE');
  expect(props.myNumber).toBe(123.456);
  expect(props.myBoolean).toBe(false);

  expect(props.onclick).toBeFalsy();
  expect(props.ariaText).toBeFalsy();
  expect(props.dataX).toBeFalsy();
  expect(props.class).toBeFalsy();
  expect(props.dir).toBeFalsy();
  expect(props.id).toBeFalsy();
  expect(props.is).toBeFalsy();
  expect(props.hidden).toBeFalsy();
  expect(props.lang).toBeFalsy();
  expect(props.style).toBeFalsy();
  expect(props.tabindex).toBeFalsy();
  expect(props.title).toBeFalsy();
});

describe('HTMLCustomElement', function () {
  beforeEach(function () {
    // Jest will wait for this promise to resolve before running tests.
  });

  it('#define', function () {
    // const ce = new HTMLCustomElement();
    class MyEl extends HTMLElement {}
    HTMLCustomElement.define('my-el', MyEl);
    expect(customElements.get('my-el')).toBeTruthy();

    HTMLCustomElement.define('my-el', MyEl); // defining again does not cause error
    expect(customElements.get('my-el')).toBeTruthy();
  });

  it('#disconnectedCallback', function () {
    // cannot test since the following does not work with jest test
    //   class HTMLCustomElement extends HTMLElement
    //   new HTMLCustomElement
  });

  it('#renderWith', function () {
    // cannot test since the following does not work with jest test
    //   class HTMLCustomElement extends HTMLElement
    //   new HTMLCustomElement
  });

  it('#detectChanges', function () {
    // cannot test since the following does not work with jest test
    //   class HTMLCustomElement extends HTMLElement
    //   new HTMLCustomElement
  });
  
});

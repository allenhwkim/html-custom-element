import util from '../util';
const template = require('./hello-clock.html');

class HelloClock  extends HTMLElement {
  connectedCallback() {
    util.setPropsFromAttrs.bind(this)();    // 1st
    util.setInnerHTML.bind(this)(template); // 2nd
    util.setEventsFromAttrs.bind(this)();   // 3rd
    this.addAnimations();
  }

  addAnimations() {
    var now     = new Date(),
    hourDeg   = now.getHours() / 12 * 360 + now.getMinutes() / 60 * 30,
    minuteDeg = now.getMinutes() / 60 * 360 + now.getSeconds() / 60 * 6,
    secondDeg = now.getSeconds() / 60 * 360,
    stylesDeg = [
      "@-webkit-keyframes rotate-hour{from{transform:rotate(" + hourDeg + "deg);}to{transform:rotate(" + (hourDeg + 360) + "deg);}}",
      "@-webkit-keyframes rotate-minute{from{transform:rotate(" + minuteDeg + "deg);}to{transform:rotate(" + (minuteDeg + 360) + "deg);}}",
      "@-webkit-keyframes rotate-second{from{transform:rotate(" + secondDeg + "deg);}to{transform:rotate(" + (secondDeg + 360) + "deg);}}",
      "@-moz-keyframes rotate-hour{from{transform:rotate(" + hourDeg + "deg);}to{transform:rotate(" + (hourDeg + 360) + "deg);}}",
      "@-moz-keyframes rotate-minute{from{transform:rotate(" + minuteDeg + "deg);}to{transform:rotate(" + (minuteDeg + 360) + "deg);}}",
      "@-moz-keyframes rotate-second{from{transform:rotate(" + secondDeg + "deg);}to{transform:rotate(" + (secondDeg + 360) + "deg);}}"
    ];
    this.querySelector('.clock-animations').innerHTML = `<style>${stylesDeg.join('')}</style>`;
  }
}
customElements.define('hello-clock', HelloClock);

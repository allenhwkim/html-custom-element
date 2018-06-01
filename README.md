# hello-custom-element

> Custom Element Project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm start

# build for production with minification
npm run build
```

## Usage
### Example For Angular 1
app.js
```Javascript
import 'angular-custom-elements';
...
window.app = angular.module('app', [ ..., 'robdodson.ce-bind']);
...
angular.bootstrap(document.getElementById('app'), ['app']);
```
home.html
```html
<button ng-click="runCEFunc()">Run Custom Element updateMessage</button>

<hello-custom-element ce-one-way
  on-my-event="myNgFunc($event)"
  world="{{world}}"
  message="{{message}}">
</hello-custom-element>

```
home.controller.js
```Javascript
$scope.message = 'This is From Angular 1';
$scope.world = 'Angular 1 + Custom Element';

$scope.runCEFunc = function() {
  document.querySelector('hello-custom-element').updateMessage(
    `${new Date} This is updated from Angular 6`);
};

$scope.myNgFunc = function(event) {
  console.log('my-evnet fired with detail', event.detail);
}

document.querySelector('hello-custom-element').ngFunc = $scope.myNgFunc.bind($scope);
```

### Example For Angular 6
app.component.html
```html
<button (click)="runCEFunc()">Run Custom Element updateMessage</button>
<hello-custom-element #customElement
  (my-event)="myNgFunc($event)"
  [ngFunc]="myNgFunc.bind(this)"
  [world]="world"
  [message]="message">
</hello-custom-element>
```
app.component.ts
```Typescript
@Component({...})
export class AppComponent  {
  world = 'Angular6 + Custom Element'
  message = 'This is message from Angular6.';

  @ViewChild('customElement') customElement: ElementRef;

  myNgFunc(event) {
    console.log('my-evnet fired with detail', event.detail);
  }

  runCEFunc() {
    this.customElement.nativeElement.updateMessage(
      `${new Date} This is updated from Angular 6`
    );
  }
}
```

### Example For Vanilla Javascript
app.js
```Javascript
function runCEFunc(e) {
  document.querySelector('hello-custom-element').updateMessage(
    `${new Date} This is updated from Javascript`);
}
window.onload = function() {
  const customElement = document.querySelector('hello-custom-element');
  customElement.addEventListener('my-event', function(event) {
    console.log('my-evnet fired with detail', event.detail);
  });
  customElement.ngFunc = function() {
    console.log('This is a Javascript function');
  }
};
```
app.html
```html
<button onclick="runCEFunc(event)">Run Custom Element updateMessage</button>
<hello-custom-element
  world="Javascript + Custom Element"
  message="This is from message attribute">
</hello-custom-element>
```



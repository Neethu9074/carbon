# roemitter
*TL;DR; Imagine roemitter as an EventEmitter on steroids*

EventEmitters are one of the most common ways in the JavaScript ecosystem to inform observers about events, i.e. EventEmitters implement the Observer design pattern. While EventEmitters are often sufficient, we are commiting to reactive observables.

Reactive observables are beneficial for instana as events can not only be observed, but can also be composed using data-stream like observables and manipulated using common functional idioms (`map`, `reduce`, `filter`...). This allows us to route subsets of events and data to pluggables and components via stream operators.

## Usage

```javascript
import RoEmitter from 'roemitter';

const name = 'test emitter'; // name is optional. Defaults to anonymous.
const emitter = new RoEmitter(name);

// emitter.on(...) returns an Observables
// see the following doc for `forEach` and error handling
// http://bit.ly/1DDGM9W
const subscription = emitter.on('update').forEach(console.log.bind(console));
emitter.emit('update', {
  data: 42
});
// logs: {data: 42}

// stop observation
subscription.dispose();

// stop all observations
emitter.dispose();
```

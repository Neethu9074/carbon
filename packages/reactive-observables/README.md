# reactive-observables

## Usage

### Creating and Subscribing to Observables
```javascript
import {create} from 'reactive-observables';

const spec = {
  start() {
    console.log('At least one observer');
  },

  stop() {
    console.log('No more observers');
  }
};

const observable = create(spec);

const disposable = observable.map(v => v * 2)
  .subscribe(v => console.log(v));
// => At least one observer

observable.emit('21');
//=> 42

disposable.dispose();
//=> No more observers
```

### Combining Observables
```javascript
import {create, combineLatest} from 'reactive-observables';

const o1 = create();
const o2 = create();

const disposable = combineLatest([o1, o2])
  .subscribe(values => console.log(values));

o1.emit('1.1');
o2.emit('2.1');
//=> [1.1, 2.1]

o1.emit('1.2');
//=> [1.2, 2.1]
```

### Observing errors
```javascript
import {create} from 'reactive-observables';

const o1 = create();

o1.errors().subscribe(error => console.error(error));
o1.subscribe(msg => console.log(msg));

o1.emitError(new Error('Something went wrong...'));
//=> Error{message: 'Something went wrong...'}
```

### Emitting latest value on subscribe
```javascript
import {create} from 'reactive-observables';

const observable = create({
  emitLatestOnSubscribe: true
});

observable.emit(21);

observable.map(v => v * 2).subscribe(v => console.log(v));
//=> 42
```

## Why no Rx.JS?

### Errors dispose observers
Observers are getting disposed as soon as an error is thrown.

```javascript
const subject = new Rx.Subject();

subject.map(v => v * 3).subscribe(v => console.log('Got:', v));

subject.onNext(2);//=> 2
subject.onError(new Error());
subject.onNext(4);
```

This is even worse when `subscribe` functions are throwing errors. Errors can happen for a variety of reasons. For many use cases it is not a good solution to stop emitting messages completely.

```javascript
const subject = new Rx.Subject();

subject.subscribe(v => {
  if (v === 2) throw new Error();
  console.log('Got:', v);
});

subject.onNext(1);//=> 1
subject.onNext(2);
subject.onNext(3);

```

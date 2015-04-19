# ui-services

## Conveyer
A conveyer is mix of Rx.JS observables, immutable data structures and a contract.

### Usage
```javascript
import {create} from 'instana-ui-services/conveyer';
import InventoryConveyer from 'instana-ui-services/conveyer/InventoryConveyer';

const pluginId = 'com.instana.forge.infrastructure.os.OS';
const observable = create(InventoryConveyer, {pluginId});

const subscription = observable.subscribe(
  nextEvent => console.log(nextEvent),
  error => console.error(error),
  completedEvent => console.log(completedEvent)
);

// at some point later
subscription.dispose();
```

On creation of an conveyer, an Rx.JS observable is returned. This observable can be used to subscribe to events via regular Rx.JS mechanisms. Additionally, subscriptions can be disposed of via `subscription.dispose()`. This makes it simple and very convenient to dispose of required resources.

### Contract and Guarantees
 - The `create` function guarantees that there is only ever one conveyer instance being created for the same parameters. This means that multiple subscriptions to OS plugin snapshots (via `InventoryConveyer`) will not result in multiple `InventoryConveyer`s.
 - The `nextEvent` will always be an [immutable.js](http://facebook.github.io/immutable-js/) value. Additionally, Conveyers guarantee that the minimal number of changes necessary will have been applied to the immutable object tree between events. This make it incredibly easy to do change detection in our UI as we will only need reference checks (`a === b`).
 - Data events will only be published on changes, i.e. there will never be two successive events with the same values.

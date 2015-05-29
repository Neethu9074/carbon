# ui-services

## Conveyer
A conveyer is mix of reactive observables, immutable data structures and a contract.

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

On creation of an conveyer, a reactive observable is returned. This observable can be used to subscribe to events via regular reactive observable mechanisms. Additionally, subscriptions can be disposed of via `subscription.dispose()`. This makes it simple and very convenient to dispose of required resources.

### Contract and Guarantees
 - The `create` function guarantees that there is only ever one conveyer instance being created for the same parameters. This means that multiple subscriptions to OS plugin snapshots (via `InventoryConveyer`) will not result in multiple `InventoryConveyer`s.
 - The `nextEvent` will always be an [immutable.js](http://facebook.github.io/immutable-js/) value. Additionally, Conveyers guarantee that the minimal number of changes necessary will have been applied to the immutable object tree between events. This make it incredibly easy to do change detection in our UI as we will only need reference checks (`a === b`).
 - Data events will only be published on changes, i.e. there will never be two successive events with the same values.


## Events and Event Bus
A global event bus is availabe via this project. The event bus can be used to control various interactions in the system. This section and the following subsections describe the event bus usage and the possible events.

### Focusing on a snapshot
```javascript
import eventBus from 'instana-ui-services/eventbus';
import Immutable from 'immutable';

eventBus.emit('focus', {
  snapshot: Immutable.fromJS({
    hostId,
    pluginId,
    steadyId
  }),
  zoom: true
});
```

### Showing metrics
```javascript
import eventBus from 'instana-ui-services/eventbus';

eventBus.emit('showMetrics', {
  metrics: [
    'memory.free.5000.mean'
  ]
});
```

### Hiding metrics
Call this event if the metrics shall be disabled (and not be shown anymore)
```javascript
import eventBus from 'instana-ui-services/eventbus';

eventBus.emit('hideMetrics');
```

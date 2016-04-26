import {create} from 'reactive-observables';

import createObservableIfMissing from 'in-services/subscription/subscriptionObservablesCache';
import {theme} from 'in-services/theme';


export default createObservableIfMissing.bind(null, {
  getId,
  createObservable: createSnapshotObservable
});

function getId({event, time}) {
  return event.get('id') + event.get('end') + event.getIn(['problem', 'severity']) + time;
}

function createSnapshotObservable({event, time}) {
  const observable = create({
    start(ob) {
      onData(ob);
    },

    stop() {
    }
  });

  return observable;

  function onData(ob) {
    const defaultColor = theme.health[0];

    const eventType = event.get('type');
    if (eventType === 'incident' ||
        eventType === 'change') {
      ob.emit(defaultColor);
      return;
    }
    if (!time) {
      if (!event.get('end')) {
        // live mode and event is open
        ob.emit(theme.health[event.getIn(['problem', 'severity'], 0)]);
        return;
      }
      // live mode and event is closed
      ob.emit(defaultColor);
      return;
    } else if (event.get('end') < time) {
      // event is closed
      ob.emit(defaultColor);
      return;
    }

    ob.emit(theme.health[event.getIn(['problem', 'severity'], 0)]);
    return;
  }
}

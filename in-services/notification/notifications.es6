import {createLogger} from 'instalog';

import {health, mapSeverityToHealth} from 'in-services/health';
import {openEventsAtServerTime$} from 'in-stores/events';
import {settingsStore} from 'in-services/settings';
import {getSnapshot} from 'in-stores/snapshot';
import {getLabel} from 'in-sdk/snapshot';


const logger = createLogger('notification');
let disposable;
let previousEvents = null;

settingsStore.nextFrame().subscribe(data => {
  if (data.get('desktopNotification')) {
    startTracking();
  } else {
    stopTracking();
  }
});


function startTracking() {
  disposable = openEventsAtServerTime$.subscribe(events => {
    // show messages only if Browser Window is currently not visible
    if (document.hidden == null || !document.hidden) {
      return;
    }

    // recreate the list of previous events if first start or if an event has been removed
    if (previousEvents === null || Object.keys(previousEvents).length > events.length) {
      previousEvents = {};
      events.forEach(event => previousEvents[event.get('id')] = 1);
    }

    events.forEach(event => {
      const problem = event.get('problem');
      getSnapshot(problem.get('snapshotId')).once(snapshot => {
        const eventId = event.get('id');
        if (previousEvents[eventId] !== 1) {
          previousEvents[eventId] = 1;
          const severity = mapSeverityToHealth(event.get('severity'));
          if (severity === health.warning || severity === health.danger) {
            showMessage(getLabel(snapshot), event.get('title'));
          }
        }
      });
    });
  });
}

function stopTracking() {
  if (disposable) {
    disposable.dispose();
    disposable = null;
  }
}

function showMessage(title, body) {
  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      icon: location.origin + '/favicon.png',
      body
    });
    logger.debug('a notification was send', notification);
  }
}

function isDesktopNotificationAvailable() {
  return 'Notification' in window;
}

export function askPermission(callback) {
  if (isDesktopNotificationAvailable()) {
    switch (Notification.permission) {
      case 'denied':
        callback(false);
        break;
      case 'granted':
        callback(true);
        break;
      case 'default':
        Notification.requestPermission(permission => {
          if (permission === 'granted') {
            callback(true);
          } else {
            callback(false);
          }
        });
        break;
      default:
        callback(false);
        break;
    }
  }
}

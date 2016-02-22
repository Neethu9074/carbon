import {extractCoordinates, getFullSnapshot} from 'in-services/snapshots';
import {health, mapSeverityToHealth} from 'in-services/health';
import {getOpenIssues} from 'in-services/issueTracker';
import {settingsStore} from 'in-services/settings';
import {getLabel} from 'in-sdk/snapshot';

let disposable;
let previousIssues = null;

settingsStore.subscribe(data => {
  const desktopNotification = data.getIn(['desktopNotification']);
  if (desktopNotification) {
    startTracking();
  } else {
    stopTracking();
  }

});


function startTracking() {
  disposable = getOpenIssues().subscribe((issues) => {

    // show messages only if Browser Window is currently not visible
    if (document.hidden == null || !document.hidden) {
      return;
    }
    // recreate the list of previous issues if first start or if an issue has been removed
    if (previousIssues === null || Object.keys(previousIssues).length > issues.size) {
      previousIssues = {};
      issues.forEach(issue => {
        previousIssues[issue.get('id')] = 1;
      });
    }

    issues.forEach(issue => {
      if (previousIssues[issue.get('id')] !== 1) {
        previousIssues[issue.get('id')] = 1;
        const coordinates = extractCoordinates(issue.get('problem'));
        const severity = mapSeverityToHealth(issue.getIn(['problem', 'severity']));
        if (severity === health.warning || severity === health.danger) {
          getFullSnapshot(coordinates).once(snapShot => {
            showMessage(getLabel(snapShot), issue.getIn(['problem', 'problemText']));
          });
        }
      }
    });
  });
}

function stopTracking() {
  if (disposable) {
    disposable.dispose();
    disposable = null;
  }
}

function showMessage(title, problem) {
  if (Notification.permission === 'granted') {
    // a Notification can only be created using *new*. Actually I don't need any instance of this, so suppress warnings
    /* eslint-disable no-new */
    new Notification(title, {
      icon: location.origin + '/favicon.png',
      body: problem
    });
    /* eslint-enable no-new */
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

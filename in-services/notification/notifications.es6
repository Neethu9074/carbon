import {getOpenIssues} from 'in-services/issueTracker';
import {settingsStore} from 'in-services/settings';
import {getLabel} from 'in-sdk/snapshot';
import {extractCoordinates, getFullSnapshot} from 'in-services/snapshots/snapshots';

let disposal;
let previousIssues = null;

settingsStore.subscribe(data => {
  const desktopNotification = data.getIn(['map', 'desktopNotification']);

  if (desktopNotification) {
    startTracking();
  } else {
    stopTracking();
  }

});


function startTracking() {
  disposal = getOpenIssues().subscribe((issues) => {

    //show messages only if Browser Window is currently not visible
    if (document.hidden != null && document.hidden) {

      //recreate the list of previous issues if first start or if an issue has been removed
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
          const snapShotObservable = getFullSnapshot(coordinates);
          snapShotObservable.once(snapShot => {
               showMessage(getLabel(snapShot), issue.get('problem').get('problemText'));
          });
        }
      });
    }
  });
}

function stopTracking() {
  if (disposal) {
    disposal.dispose();
    disposal = null;
  }
}

function showMessage(title, problem) {
  if (Notification.permission === 'granted') {
    //a Notification can only be created using *new*. Actually I don't need any instance of this, so suppress warnings
    /*eslint-disable */
    new Notification(title, {
      icon: location.origin + '/favicon.png',
      body: problem
    });
    /*eslint-enable */
  }
}

function isDesktopNotificationAvailable() {
  return 'Notification' in window;
}

export function askPermission() {
  return new Promise((resolve, reject) => {
    if (isDesktopNotificationAvailable()) {
      switch (Notification.permission) {
        case 'denied':
          reject();
          break;
        case 'granted':
          resolve();
          break;
        case 'default':
          Notification.requestPermission(function(permission) {
            if (permission === 'granted') {
              resolve();
            } else {
              reject();
            }
          });
          break;
        default:
          reject();
          break;
      }
    }
  });
}





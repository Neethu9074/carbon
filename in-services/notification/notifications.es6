import {getOpenIssues} from 'in-services/issueTracker';
import {settingsStore} from 'in-services/settings';
import {getLabel} from 'in-sdk/snapshot';
import {extractCoordinates, getFullSnapshot} from 'in-services/snapshots/snapshots';

let disposal;

settingsStore.subscribe(data => {
  const desktopNotification = data.getIn(['map', 'desktopNotification']);

  if (desktopNotification) {
    startTracking();
  } else {
    stopTracking();
  }

});


function startTracking() {
  let now = Date.now();
  disposal = getOpenIssues().subscribe((issues) => {
    issues.forEach(issue => {
      if (issue.get('start') > now) {
        now = Date.now();

        getFullSnapshot(extractCoordinates(issue.get('problem'))).once(function(snapShot) {
          showMessage(getLabel(snapShot), issue.get('problem').get('problemText'));
        });
      }
    });
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
    if (document.hidden != null && document.hidden) {
      //a Notification can only be created using *new*. Actually I don't need any instance of this, so suppress warnings
      /*eslint-disable */
      new Notification(title, {
        //interesting: /favicon.png doesn't work in every case...
        icon: 'https://pbs.twimg.com/profile_images/628597970473197570/bbTby2mS_400x400.jpg',
        body: problem
      });
      /*eslint-enable */
    }
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
        default: reject();
              break;
      }
    }
  });
}





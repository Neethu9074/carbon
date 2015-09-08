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
  //compare lists
  disposal = getOpenIssues().subscribe((issues) => {
    issues.forEach(issue => {
      if (issue.get('start') > now) {
        const coordinates = extractCoordinates(issue.get('problem'));
        const snapShotObservable = getFullSnapshot(coordinates);
        /*eslint-disable */
        now = Date.now();
        console.log("1");
        snapShotObservable.once(snapShot => {
            //const groupId = getZone(groupSnapshot);
            //this.addNodeToGroup(triple, groupId);
          console.log("2", getLabel(snapShot));
          showMessage(getLabel(snapShot), issue.get('problem').get('problemText'));
          });
        /*eslint-enable */
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
    //show messages only if Browser Window is currently not visible
    //if (document.hidden != null && document.hidden) {
      //a Notification can only be created using *new*. Actually I don't need any instance of this, so suppress warnings
      /*eslint-disable */
      new Notification(title, {
          icon: location.origin + '/favicon.png',
          body: problem
        });
        /*eslint-enable */
    }
  //}
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





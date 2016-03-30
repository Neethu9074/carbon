import {createLogger} from 'instalog';

import {health, mapSeverityToHealth} from 'in-services/health';
import {openIssues$} from 'in-services/issueTracker';
import {settingsStore} from 'in-services/settings';
import {getSnapshot} from 'in-stores/snapshot';
import {getLabel} from 'in-sdk/snapshot';


const logger = createLogger('notification');
let disposable;
let previousIssues = null;

settingsStore.nextFrame().subscribe(data => {
  if (data.get('desktopNotification')) {
    startTracking();
  } else {
    stopTracking();
  }
});


function startTracking() {
  disposable = openIssues$.subscribe(issues => {
    // show messages only if Browser Window is currently not visible
    if (document.hidden == null || !document.hidden) {
      return;
    }
    // recreate the list of previous issues if first start or if an issue has been removed
    if (previousIssues === null || Object.keys(previousIssues).length > issues.size) {
      previousIssues = {};
      issues.forEach(issue => previousIssues[issue.get('id')] = 1);
    }

    issues.forEach(issue => {
      const problem = issue.get('problem');
      getSnapshot(problem.get('snapshotId')).once(snapshot => {
        const issueId = issue.get('id');
        if (previousIssues[issueId] !== 1) {
          previousIssues[issueId] = 1;
          const severity = mapSeverityToHealth(problem.get('severity'));
          if (severity === health.warning || severity === health.danger) {
            showMessage(getLabel(snapshot), problem.get('problemText'));
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

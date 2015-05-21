'use strict';

const selector = '.in-fly-out-notification';
const interval = 10000;

let intervalHandle = null;
let lastClickedNotification = 0;

export function start() {
  intervalHandle = setInterval(cycleThroughNotifications, interval);
}

function cycleThroughNotifications() {
  const notifications = document.querySelectorAll(selector);
  if (notifications.length === 0) {
    return;
  }

  if (lastClickedNotification > (notifications.length - 1)) {
    lastClickedNotification = 0;
  }

  notifications[lastClickedNotification].click();
  lastClickedNotification++;
}

export function stop() {
  if (intervalHandle) {
    clearInterval(intervalHandle);
    intervalHandle = null;
    lastClickedNotification = 0;
  }
}

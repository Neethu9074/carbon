import { ConsoleAppender, addAppender } from '@instana/logger';

import WeaselLogAppender from 'in-client/js/WeaselLogAppender';

// the global console object does not exist in all browsers. A ConsoleAppender
// should thus only be added when it can actually log to a browser console.
if (ConsoleAppender.isPossible()) {
  const consoleAppender = new ConsoleAppender();
  consoleAppender.setActivePriority(11);
  addAppender(consoleAppender);
}

if (!__DEV__) {
  const weaselLogAppender = new WeaselLogAppender();
  weaselLogAppender.setActivePriority(30); // info
  addAppender(weaselLogAppender);
}

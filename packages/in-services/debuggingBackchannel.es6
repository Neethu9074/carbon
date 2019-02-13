import { get } from 'lodash';

import getUiDebuggingInstructions from 'in-subscription/getUiDebuggingInstructions';
import { formatDurationAccurately } from 'in-services/formatters/date';
import { connection, getDebuggingData } from 'in-connection';
import { allStates } from 'in-stores/store';

const windowOpenTime = Date.now();

export function init() {
  getUiDebuggingInstructions().subscribe(gatherAndTransmitDebuggingData);
}

function gatherAndTransmitDebuggingData(instructions) {
  const debugData = {
    href: window.location.href,
    storeStates: allStates,
    ...getDebuggingData(),
    visibilityState: document.visibilityState,
    windowOpenTime: formatDurationAccurately(Date.now() - windowOpenTime, 1000)
  };

  if (instructions.selector.paths.length === 0) {
    connection.send('debug', ensureJsonSerializability(debugData));
  } else {
    const filtered = {};

    instructions.selector.paths.forEach(path => {
      const value = get(debugData, path);
      if (value !== undefined) {
        filtered[path.join('.')] = value;
      }
    });

    connection.send('debug', ensureJsonSerializability(filtered));
  }

  if (instructions.reloadWindow === true) {
    // Wait for debug data transmission
    setTimeout(() => window.location.reload(), 5000);
  }
}

function ensureJsonSerializability(obj) {
  for (let key in obj) {
    try {
      JSON.stringify(obj[key]);
    } catch (e) {
      obj[key] = 'JSON serialization failed: ' + e.message;
    }
  }
  return obj;
}

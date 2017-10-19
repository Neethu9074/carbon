import getUiDebuggingInstructions from 'in-services/subscription/getUiDebuggingInstructions';
import { connection, getDebuggingData } from 'in-services/connection';
import { allStates } from 'in-stores/store';

export function init() {
  getUiDebuggingInstructions().subscribe(gatherAndTransmitDebuggingData);
}

function gatherAndTransmitDebuggingData() {
  const debugData = {
    href: window.location.href,
    storeStates: allStates,
    subscriptions: getDebuggingData()
  };

  connection.send('debug', debugData);
}

/* eslint-disable no-console */
import { setLoadTestEnabled } from 'in-services/subscription/subscription';
import { trySet, get } from 'in-services/localStorage';

window.instana.dev = window.instana.dev || {};

const localStorageKey = 'instana.dev.loadTestEnabled';
window.instana.dev.enableLoadTest = () => {
  trySet(localStorageKey, true);
  return setLoadTestEnabled(true);
};
window.instana.dev.disableLoadTest = () => {
  trySet(localStorageKey, null);
  return setLoadTestEnabled(false);
};

let loadTestEnabled = get(localStorageKey) === 'true' ? true : false;
if (loadTestEnabled) {
  setLoadTestEnabled(loadTestEnabled);
  console.log('LOAD TEST IS ENABLED. You toggle it with window.instana.dev.en- /disableLoadTest()');
}

import { setLoadTestEnabled } from 'in-services/subscription/subscription';

window.instana.dev = window.instana.dev || {};

window.instana.dev.enableLoadTest = () => {
  return setLoadTestEnabled(true);
};
window.instana.dev.disableLoadTest = () => {
  return setLoadTestEnabled(false);
};

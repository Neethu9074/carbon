import { setLoadTestEnabled } from 'in-services/subscription/subscription';

window.instana.dev = window.instana.dev || {};

window.instana.dev.enableLoadTest = () => {
  setLoadTestEnabled(true);
};
window.instana.dev.disableLoadTest = () => {
  setLoadTestEnabled(false);
};

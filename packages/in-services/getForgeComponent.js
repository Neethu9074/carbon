/* global require:false */

const context = require.context('../in-forge/plugins', true, /\/[a-zA-Z0-9]+\.js$/);

export default function getForgeComponent(path) {
  return context(path).default;
}

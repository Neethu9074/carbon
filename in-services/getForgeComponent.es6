/*global require:false*/

const context = require.context('../in-forge', true, /\/[a-zA-Z0-9]+\.es6$/);

export default function getForgeComponent(path) {
  return context(path);
}
